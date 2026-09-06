"""Junta os GLB por peca num GLB so: uma malha com uma primitiva por peca,
cada uma com seu material. Centraliza o conjunto em X/Z e apoia a base em y=0,
que e o que o componente do site espera."""
import json
import os
import struct
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from glb_io import ler_glb  # noqa: E402
from stl_para_glb import tinta_de  # noqa: E402

PASTA = sys.argv[1]
SAIDA = sys.argv[2]
IGNORAR = set(a for a in (sys.argv[3].split(",") if len(sys.argv) > 3 else []) if a)

pecas = []
for arq in sorted(os.listdir(PASTA)):
    if not arq.endswith(".glb") or arq[:-4] in IGNORAR:
        continue
    pos, idx, _ = ler_glb(os.path.join(PASTA, arq))
    pecas.append((arq[:-4], pos, idx))

todos = np.concatenate([p for _, p, _ in pecas])
centro = (todos.min(0) + todos.max(0)) / 2
base_y = todos.min(0)[1]
altura = todos.max(0)[1] - base_y
fator = 1.0 / altura  # normaliza para 1 unidade de altura

print(f"{len(pecas)} pecas  bbox {todos.min(0).round(1).tolist()} -> {todos.max(0).round(1).tolist()}")
print(f"altura original {altura:.1f} unidades")


def normais(pos, idx):
    n = np.zeros(pos.shape, dtype=np.float64)
    a, b, c = pos[idx[:, 0]], pos[idx[:, 1]], pos[idx[:, 2]]
    face = np.cross(b - a, c - a)
    for k in range(3):
        np.add.at(n, idx[:, k], face)
    comp = np.linalg.norm(n, axis=1, keepdims=True)
    comp[comp == 0] = 1
    return (n / comp).astype(np.float32)


blobs, views, acessores, primitivas, materiais = [], [], [], [], []
corrente = 0


def add_view(dados, alvo):
    global corrente
    blobs.append(dados)
    views.append({"buffer": 0, "byteOffset": corrente, "byteLength": len(dados), "target": alvo})
    corrente += len(dados) + (-len(dados)) % 4
    return len(views) - 1


total_tri = 0
for nome, pos, idx in pecas:
    p = ((pos - centro) * fator).astype(np.float32)
    p[:, 1] = ((pos[:, 1] - base_y) * fator).astype(np.float32)
    nrm = normais(p, idx)
    ind = idx.astype(np.uint32).ravel()
    total_tri += len(idx)

    a_pos = len(acessores)
    acessores.append({"bufferView": add_view(p.tobytes(), 34962), "componentType": 5126,
                      "count": len(p), "type": "VEC3",
                      "min": p.min(0).tolist(), "max": p.max(0).tolist()})
    acessores.append({"bufferView": add_view(nrm.tobytes(), 34962), "componentType": 5126,
                      "count": len(nrm), "type": "VEC3"})
    acessores.append({"bufferView": add_view(ind.tobytes(), 34963), "componentType": 5125,
                      "count": len(ind), "type": "SCALAR"})

    chave, (cor, metal, rugos) = tinta_de(nome)
    # material batizado pela tinta, nao pela peca: assim as quatro partes de
    # cabelo (por exemplo) viram um material so, o dedup funde e o join junta
    # as primitivas -- menos draw call por quadro
    mat = {"name": chave, "pbrMetallicRoughness": {
        "baseColorFactor": [cor[0], cor[1], cor[2], 1.0],
        "metallicFactor": metal, "roughnessFactor": rugos}}
    if chave == "susanoo":
        # as laminas de chakra sao resina translucida acesa por dentro
        mat["emissiveFactor"] = [0.05, 0.22, 0.62]
    materiais.append(mat)
    primitivas.append({"attributes": {"POSITION": a_pos, "NORMAL": a_pos + 1},
                       "indices": a_pos + 2, "material": len(materiais) - 1})

binario = bytearray()
for b in blobs:
    binario.extend(b)
    binario.extend(b"\0" * ((-len(b)) % 4))

gltf = {
    "asset": {"version": "2.0", "generator": "narakaito montagem"},
    "scene": 0,
    "scenes": [{"nodes": [0]}],
    "nodes": [{"mesh": 0, "name": "madara"}],
    "meshes": [{"name": "madara", "primitives": primitivas}],
    "materials": materiais,
    "buffers": [{"byteLength": len(binario)}],
    "bufferViews": views,
    "accessors": acessores,
}
js = json.dumps(gltf, separators=(",", ":")).encode("utf-8")
js += b" " * ((-len(js)) % 4)
total = 12 + 8 + len(js) + 8 + len(binario)
with open(SAIDA, "wb") as f:
    f.write(struct.pack("<4sII", b"glTF", 2, total))
    f.write(struct.pack("<I4s", len(js), b"JSON"))
    f.write(js)
    f.write(struct.pack("<I4s", len(binario), b"BIN\0"))
    f.write(binario)
print(f"{SAIDA}: {total/1048576:.2f} MB, {total_tri:,} triangulos, {len(materiais)} materiais")
