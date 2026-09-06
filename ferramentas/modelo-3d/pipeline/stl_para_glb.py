"""STL binario -> GLB por peca, ja com material.

O STL nao carrega cor nenhuma, so triangulos soltos. Duas coisas acontecem aqui:

1. Solda de vertices. O STL repete cada vertice em cada triangulo que o toca
   (3 x n_tri vertices). Sem soldar, o simplificador nao consegue colapsar
   aresta nenhuma e a malha nao reduz.
2. Cor por peca. Como o kit vem separado por parte (Armor, Clothing, Hair,
   Susanoo...), da para pintar pelo nome do arquivo: e o mais perto da peca
   pintada que se chega sem UV e sem textura.
"""
import json
import os
import struct
import sys

import numpy as np

# baseColor, metallic, roughness -- calibrado pelas fotos da peca pintada
TINTAS = {
    "armor": ((0.42, 0.09, 0.07), 0.0, 0.45),
    "shoulder_armor": ((0.42, 0.09, 0.07), 0.0, 0.45),
    "clothing": ((0.20, 0.16, 0.26), 0.0, 0.85),
    "torso": ((0.24, 0.19, 0.30), 0.0, 0.80),
    "legs": ((0.20, 0.17, 0.28), 0.0, 0.85),
    "arm": ((0.22, 0.18, 0.29), 0.0, 0.82),
    "head": ((0.68, 0.50, 0.42), 0.0, 0.65),
    "hand": ((0.13, 0.12, 0.14), 0.0, 0.70),
    "hair": ((0.06, 0.05, 0.07), 0.0, 0.55),
    "shoe": ((0.16, 0.13, 0.12), 0.0, 0.75),
    "gunbai": ((0.85, 0.82, 0.75), 0.0, 0.55),
    "sickle": ((0.35, 0.35, 0.38), 0.85, 0.30),
    "kunai": ((0.38, 0.38, 0.41), 0.90, 0.28),
    "shuriken": ((0.38, 0.38, 0.41), 0.90, 0.28),
    "chain": ((0.30, 0.29, 0.31), 0.85, 0.35),
    "susanoo": ((0.10, 0.32, 0.85), 0.0, 0.18),
    "base": ((0.26, 0.26, 0.24), 0.0, 0.90),
    "tree": ((0.20, 0.22, 0.17), 0.0, 0.92),
}


def tinta_de(nome):
    n = nome.lower()
    for chave in ("shoulder_armor", "susanoo", "clothing", "shuriken", "gunbai",
                  "sickle", "kunai", "chain", "armor", "torso", "legs", "arm",
                  "head", "hand", "hair", "shoe", "base", "tree"):
        if n.startswith(chave):
            return chave, TINTAS[chave]
    return "base", TINTAS["base"]


def ler_stl(caminho):
    d = open(caminho, "rb").read()
    n = struct.unpack("<I", d[80:84])[0]
    bruto = np.frombuffer(d[84:84 + n * 50], dtype=np.uint8).reshape(n, 50)
    # bytes 12..48 de cada triangulo sao os 3 vertices (9 floats)
    verts = np.frombuffer(np.ascontiguousarray(bruto[:, 12:48]).tobytes(),
                          dtype="<f4").reshape(n * 3, 3)
    return verts


def soldar(verts):
    vista = np.ascontiguousarray(verts).view([("", verts.dtype)] * 3).ravel()
    unicos, inverso = np.unique(vista, return_inverse=True)
    pos = unicos.view(verts.dtype).reshape(-1, 3)
    return pos, inverso.astype(np.uint32).reshape(-1, 3)


def normais(pos, idx):
    n = np.zeros(pos.shape, dtype=np.float64)
    a, b, c = pos[idx[:, 0]], pos[idx[:, 1]], pos[idx[:, 2]]
    # cross sem normalizar: o modulo ja e o dobro da area, entao os
    # triangulos grandes pesam mais na media, que e o que se quer
    face = np.cross(b - a, c - a)
    for k in range(3):
        np.add.at(n, idx[:, k], face)
    comp = np.linalg.norm(n, axis=1, keepdims=True)
    comp[comp == 0] = 1
    return (n / comp).astype(np.float32)


def escrever_glb(destino, pos, idx, nrm, cor, metal, rugos, nome):
    idx_dtype = np.uint16 if len(pos) < 65536 else np.uint32
    idx_tipo = 5123 if idx_dtype is np.uint16 else 5125
    ind = idx.astype(idx_dtype).ravel()

    blobs = [pos.astype(np.float32).tobytes(), nrm.tobytes(), ind.tobytes()]
    offsets, corrente = [], 0
    for b in blobs:
        offsets.append(corrente)
        corrente += len(b) + (-len(b)) % 4
    binario = bytearray()
    for off, b in zip(offsets, blobs):
        binario.extend(b)
        binario.extend(b"\0" * ((-len(b)) % 4))

    gltf = {
        "asset": {"version": "2.0", "generator": "narakaito stl->glb"},
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0, "name": nome}],
        "meshes": [{"name": nome, "primitives": [
            {"attributes": {"POSITION": 0, "NORMAL": 1}, "indices": 2, "material": 0}
        ]}],
        "materials": [{
            "name": nome,
            "pbrMetallicRoughness": {
                "baseColorFactor": [cor[0], cor[1], cor[2], 1.0],
                "metallicFactor": metal,
                "roughnessFactor": rugos,
            },
        }],
        "buffers": [{"byteLength": len(binario)}],
        "bufferViews": [
            {"buffer": 0, "byteOffset": offsets[0], "byteLength": len(blobs[0]), "target": 34962},
            {"buffer": 0, "byteOffset": offsets[1], "byteLength": len(blobs[1]), "target": 34962},
            {"buffer": 0, "byteOffset": offsets[2], "byteLength": len(blobs[2]), "target": 34963},
        ],
        "accessors": [
            {"bufferView": 0, "componentType": 5126, "count": len(pos), "type": "VEC3",
             "min": pos.min(0).tolist(), "max": pos.max(0).tolist()},
            {"bufferView": 1, "componentType": 5126, "count": len(pos), "type": "VEC3"},
            {"bufferView": 2, "componentType": idx_tipo, "count": len(ind), "type": "SCALAR"},
        ],
    }

    js = json.dumps(gltf, separators=(",", ":")).encode("utf-8")
    js += b" " * ((-len(js)) % 4)
    total = 12 + 8 + len(js) + 8 + len(binario)
    with open(destino, "wb") as f:
        f.write(struct.pack("<4sII", b"glTF", 2, total))
        f.write(struct.pack("<I4s", len(js), b"JSON"))
        f.write(js)
        f.write(struct.pack("<I4s", len(binario), b"BIN\0"))
        f.write(binario)


if __name__ == "__main__":
    entrada, saida = sys.argv[1], sys.argv[2]
    os.makedirs(saida, exist_ok=True)
    relatorio = {}
    for arq in sorted(os.listdir(entrada)):
        if not arq.lower().endswith(".stl"):
            continue
        nome = arq[:-4]
        destino = os.path.join(saida, nome + ".glb")
        if os.path.exists(destino):
            continue
        verts = ler_stl(os.path.join(entrada, arq))
        pos, idx = soldar(verts)
        nrm = normais(pos, idx)
        chave, (cor, metal, rugos) = tinta_de(nome)
        escrever_glb(destino, pos, idx, nrm, cor, metal, rugos, nome)
        relatorio[nome] = {"tri": len(idx), "vert": len(pos), "tinta": chave}
        print(f"{nome:26s} {len(idx):8d} tri  {len(pos):8d} vert  tinta={chave}", flush=True)
    json.dump(relatorio, open(os.path.join(saida, "_relatorio.json"), "w"), indent=1)
