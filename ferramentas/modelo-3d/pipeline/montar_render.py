"""Le os GLB por peca, monta tudo num espaco so e rasteriza, so para conferir
a montagem e a divisao de cores antes de mandar para o site."""
import json
import math
import os
import struct
import sys

import numpy as np
from PIL import Image

PASTA = sys.argv[1] if len(sys.argv) > 1 else "glb_simples"
SAIDA = sys.argv[2] if len(sys.argv) > 2 else "montagem.png"
IGNORAR = set(a for a in (sys.argv[3].split(",") if len(sys.argv) > 3 else []) if a)
W = H = 560

TIPOS = {5126: "<f4", 5123: "<u2", 5125: "<u4", 5122: "<i2", 5121: "<u1", 5120: "<i1"}
COMPS = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}


def ler_glb(caminho):
    d = open(caminho, "rb").read()
    js_len = struct.unpack("<I", d[12:16])[0]
    js = json.loads(d[20:20 + js_len].decode("utf-8"))
    resto = d[20 + js_len:]
    bin_len = struct.unpack("<I", resto[0:4])[0]
    binario = resto[8:8 + bin_len]

    def acessor(i):
        a = js["accessors"][i]
        bv = js["bufferViews"][a["bufferView"]]
        off = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
        comp = COMPS[a["type"]]
        dt = np.dtype(TIPOS[a["componentType"]])
        passo = bv.get("byteStride")
        if passo and passo != comp * dt.itemsize:
            # atributos intercalados no mesmo bufferView (POSITION e NORMAL
            # dividindo a mesma faixa): sem respeitar o byteStride, um vira
            # o outro na leitura
            cru = np.frombuffer(binario, dtype=np.uint8,
                                count=passo * a["count"], offset=off)
            cru = cru.reshape(a["count"], passo)[:, :comp * dt.itemsize]
            arr = np.frombuffer(np.ascontiguousarray(cru).tobytes(),
                                dtype=dt).reshape(a["count"], comp)
        else:
            arr = np.frombuffer(binario, dtype=dt, count=a["count"] * comp,
                                offset=off).reshape(a["count"], comp)
        if a.get("normalized"):
            info = np.iinfo(arr.dtype)
            arr = arr.astype(np.float32) / info.max
        return arr

    prim = js["meshes"][0]["primitives"][0]
    pos = acessor(prim["attributes"]["POSITION"]).astype(np.float32)
    idx = acessor(prim["indices"]).ravel().astype(np.int64).reshape(-1, 3)
    mat = js["materials"][prim.get("material", 0)]
    cor = mat["pbrMetallicRoughness"].get("baseColorFactor", [0.8, 0.8, 0.8, 1])[:3]

    # KHR_mesh_quantization deixa a escala no no; aplico se existir
    no = js["nodes"][0]
    if "scale" in no or "translation" in no:
        s = np.array(no.get("scale", [1, 1, 1]), dtype=np.float32)
        t = np.array(no.get("translation", [0, 0, 0]), dtype=np.float32)
        pos = pos * s + t
    return pos, idx, np.array(cor, dtype=np.float32)


pecas = []
for arq in sorted(os.listdir(PASTA)):
    if not arq.endswith(".glb") or arq[:-4] in IGNORAR:
        continue
    pos, idx, cor = ler_glb(os.path.join(PASTA, arq))
    pecas.append((arq[:-4], pos, idx, cor))

desloc = 0
POS, IDX, COR = [], [], []
for nome, pos, idx, cor in pecas:
    POS.append(pos)
    IDX.append(idx + desloc)
    COR.append(np.repeat(cor[None, :], len(idx), axis=0))
    desloc += len(pos)
POS = np.concatenate(POS)
IDX = np.concatenate(IDX)
COR = np.concatenate(COR)
print(f"{len(pecas)} pecas, {len(IDX):,} triangulos, {len(POS):,} vertices")
print("bbox", POS.min(0).round(1).tolist(), POS.max(0).round(1).tolist())

centro = (POS.min(0) + POS.max(0)) / 2
escala = (POS.max(0) - POS.min(0)).max()
P = (POS - centro) / escala

quadros = []
for ang in (0, 60, 140, 250):
    a = math.radians(ang)
    rot = np.array([[math.cos(a), 0, math.sin(a)], [0, 1, 0], [-math.sin(a), 0, math.cos(a)]],
                   dtype=np.float32)
    p = P @ rot.T
    sx = (p[:, 0] * 0.9 + 0.5) * W
    sy = (0.5 - p[:, 1] * 0.9) * H
    sz = p[:, 2]

    img = np.zeros((H, W, 3), dtype=np.float32)
    zbuf = np.full((H, W), 1e9, dtype=np.float32)

    a0, a1, a2 = P[IDX[:, 0]], P[IDX[:, 1]], P[IDX[:, 2]]
    n = np.cross(a1 - a0, a2 - a0)
    n /= (np.linalg.norm(n, axis=1, keepdims=True) + 1e-9)
    n = n @ rot.T
    luz = np.array([0.45, 0.6, 0.75]); luz = luz / np.linalg.norm(luz)
    dif = np.clip(n @ luz, 0, 1) * 0.85 + 0.18
    tons = np.clip(COR * dif[:, None], 0, 1)

    ordem = np.argsort(-(sz[IDX[:, 0]] + sz[IDX[:, 1]] + sz[IDX[:, 2]]))
    for t in ordem:
        i0, i1, i2 = IDX[t]
        x0, y0, z0 = sx[i0], sy[i0], sz[i0]
        x1, y1, z1 = sx[i1], sy[i1], sz[i1]
        x2, y2, z2 = sx[i2], sy[i2], sz[i2]
        minx, maxx = int(max(0, min(x0, x1, x2))), int(min(W - 1, max(x0, x1, x2))) + 1
        miny, maxy = int(max(0, min(y0, y1, y2))), int(min(H - 1, max(y0, y1, y2))) + 1
        if minx >= maxx or miny >= maxy:
            continue
        area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)
        if area == 0:
            continue
        ys, xs = np.mgrid[miny:maxy, minx:maxx]
        px, py = xs + 0.5, ys + 0.5
        w0 = ((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py)) / area
        w1 = ((x2 - px) * (y0 - py) - (x0 - px) * (y2 - py)) / area
        w2 = 1 - w0 - w1
        dentro = (w0 >= 0) & (w1 >= 0) & (w2 >= 0)
        if not dentro.any():
            continue
        z = w0 * z0 + w1 * z1 + w2 * z2
        alvo = dentro & (z < zbuf[miny:maxy, minx:maxx])
        if not alvo.any():
            continue
        img[miny:maxy, minx:maxx][alvo] = tons[t]
        zbuf[miny:maxy, minx:maxx][alvo] = z[alvo]

    quadros.append(Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)))
    print("angulo", ang, "ok", flush=True)

folha = Image.new("RGB", (W * len(quadros), H), (10, 10, 10))
for i, q in enumerate(quadros):
    folha.paste(q, (i * W, 0))
folha.save(SAIDA)
print("salvo", SAIDA)
