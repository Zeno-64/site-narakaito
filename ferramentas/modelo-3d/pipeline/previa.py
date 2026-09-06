"""Previa rapida: projeta os vertices e pinta com z-buffer. Nao e superficie,
mas mostra montagem, silhueta e divisao de cores em segundos."""
import json, math, os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, ".")
from glb_io import ler_glb

PASTA = sys.argv[1]; SAIDA = sys.argv[2]
IGNORAR = set(a for a in (sys.argv[3].split(",") if len(sys.argv) > 3 else []) if a)
W = H = 620

P, C = [], []
usadas = []
for arq in sorted(os.listdir(PASTA)):
    if not arq.endswith(".glb") or arq[:-4] in IGNORAR: continue
    pos, idx, cor = ler_glb(os.path.join(PASTA, arq))
    P.append(pos); C.append(np.repeat(cor[None, :], len(pos), axis=0)); usadas.append(arq[:-4])
P = np.concatenate(P); C = np.concatenate(C)
print(f"{len(usadas)} pecas, {len(P):,} vertices")
print("bbox", P.min(0).round(1).tolist(), "->", P.max(0).round(1).tolist())

centro = (P.min(0) + P.max(0)) / 2
esc = (P.max(0) - P.min(0)).max()
Q = (P - centro) / esc

quadros = []
for ang in (0, 55, 130, 235):
    a = math.radians(ang)
    rot = np.array([[math.cos(a),0,math.sin(a)],[0,1,0],[-math.sin(a),0,math.cos(a)]], dtype=np.float32)
    p = Q @ rot.T
    sx = ((p[:,0]*0.92+0.5)*W).astype(np.int32)
    sy = ((0.5-p[:,1]*0.92)*H).astype(np.int32)
    sz = p[:,2]
    ok = (sx>=0)&(sx<W)&(sy>=0)&(sy<H)
    sx,sy,sz,cc = sx[ok],sy[ok],sz[ok],C[ok]
    # sombra simples pela profundidade, so para dar volume
    tom = np.clip(0.45 + (sz - sz.min())/(sz.max()-sz.min()+1e-9)*0.75, 0, 1.2)
    cores = np.clip(cc*tom[:,None], 0, 1)
    ordem = np.argsort(-sz)          # pinta do fundo para a frente
    img = np.zeros((H,W,3), dtype=np.float32)
    img[sy[ordem], sx[ordem]] = cores[ordem]
    quadros.append(Image.fromarray((img*255).astype(np.uint8)))
    print("angulo", ang, "ok", flush=True)

folha = Image.new("RGB", (W*len(quadros), H), (8,8,8))
for i,q in enumerate(quadros): folha.paste(q,(i*W,0))
folha.save(SAIDA); print("salvo", SAIDA)
