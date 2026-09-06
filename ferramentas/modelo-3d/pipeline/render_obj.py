"""Rasterizador z-buffer minimo, so para conferir se o OBJ e mesmo o Madara."""
import io
import math
import numpy as np
from PIL import Image

BASE = "C:/Users/Kevin/AppData/Local/Temp/claude/K--Kevin-workspace-site-narakaito/36e5d92f-40aa-4c4d-aa59-3507aff624df/scratchpad/madara3d/"
W = H = 520

v, vt, faces = [], [], []
for linha in io.open(BASE + "base.obj", encoding="utf-8"):
    if linha.startswith("v "):
        v.append([float(x) for x in linha.split()[1:4]])
    elif linha.startswith("vt "):
        vt.append([float(x) for x in linha.split()[1:3]])
    elif linha.startswith("f "):
        idx = []
        for p in linha.split()[1:]:
            a = p.split("/")
            idx.append((int(a[0]) - 1, int(a[1]) - 1 if len(a) > 1 and a[1] else 0))
        for k in range(1, len(idx) - 1):  # leque: quad vira dois triangulos
            faces.append([idx[0], idx[k], idx[k + 1]])

v = np.array(v, dtype=np.float32)
vt = np.array(vt, dtype=np.float32)
print("vertices", len(v), "triangulos", len(faces))

tex = np.asarray(Image.open(BASE + "texture_diffuse.png").convert("RGB"), dtype=np.uint8)
th, tw = tex.shape[:2]

centro = (v.min(0) + v.max(0)) / 2
escala = (v.max(0) - v.max(0) * 0 - v.min(0)).max()
vn = (v - centro) / escala  # normaliza para caber em ~[-0.5, 0.5]

quadros = []
for ang in (0, 90, 180, 270):
    a = math.radians(ang)
    rot = np.array(
        [[math.cos(a), 0, math.sin(a)], [0, 1, 0], [-math.sin(a), 0, math.cos(a)]],
        dtype=np.float32,
    )
    p = vn @ rot.T
    sx = (p[:, 0] * 0.86 + 0.5) * W
    sy = (0.5 - p[:, 1] * 0.86) * H
    sz = p[:, 2]

    img = np.zeros((H, W, 3), dtype=np.uint8)
    zbuf = np.full((H, W), 1e9, dtype=np.float32)

    for tri in faces:
        i0, i1, i2 = tri[0][0], tri[1][0], tri[2][0]
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
        w2 = 1.0 - w0 - w1
        dentro = (w0 >= 0) & (w1 >= 0) & (w2 >= 0)
        if not dentro.any():
            continue

        z = w0 * z0 + w1 * z1 + w2 * z2
        alvo = dentro & (z < zbuf[miny:maxy, minx:maxx])
        if not alvo.any():
            continue

        u = w0 * vt[tri[0][1], 0] + w1 * vt[tri[1][1], 0] + w2 * vt[tri[2][1], 0]
        vv = w0 * vt[tri[0][1], 1] + w1 * vt[tri[1][1], 1] + w2 * vt[tri[2][1], 1]
        tx = np.clip((u * tw).astype(np.int32), 0, tw - 1)
        ty = np.clip(((1 - vv) * th).astype(np.int32), 0, th - 1)

        janela = img[miny:maxy, minx:maxx]
        janela[alvo] = tex[ty[alvo], tx[alvo]]
        zj = zbuf[miny:maxy, minx:maxx]
        zj[alvo] = z[alvo]

    quadros.append(Image.fromarray(img))
    print("angulo", ang, "ok")

folha = Image.new("RGB", (W * len(quadros), H), (12, 12, 12))
for i, q in enumerate(quadros):
    folha.paste(q, (i * W, 0))
folha.save(BASE + "../madara_render.png")
print("salvo")
