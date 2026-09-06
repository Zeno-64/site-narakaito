"""Tenta encaixar as pecas que vieram reorientadas na origem.

Ideia: a peca certa e a que ENCOSTA muito no corpo montado e ATRAVESSA pouco.
Voxeliza tudo, testa as 24 orientacoes alinhadas a eixo (que e como um
fatiador costuma reorientar peca para impressao) e, para cada uma, avalia
TODAS as translacoes de uma vez por correlacao via FFT.
"""
import itertools
import os
import sys

import numpy as np

sys.path.insert(0, ".")
from glb_io import ler_glb  # noqa: E402

VOX = 4.0
ALT = {"Head_2", "Head_3", "Hair_2_A", "Arm_Right_2"}
ORFAS = ["Shoulder_armor_Right", "Legs", "Arm_Left_3", "Arm_Right_3",
         "Hand_1_Sickle", "Sickle_2"]
SOLTAS = {"Chain", "Gunbai_1", "Gunbai_2", "Kunai", "Shuriken1", "Shuriken2", "Susanoo_5"}


def carregar(nome):
    pos, _, _ = ler_glb(f"glb_simples/{nome}.glb")
    return pos


corpo = []
for arq in sorted(os.listdir("glb_simples")):
    n = arq[:-4]
    if not arq.endswith(".glb") or n in ALT or n in ORFAS or n in SOLTAS:
        continue
    corpo.append(carregar(n))
corpo = np.concatenate(corpo)

mn = corpo.min(0) - 40
mx = corpo.max(0) + 40
dims = np.ceil((mx - mn) / VOX).astype(int) + 1
print("grade do corpo:", dims, " voxels ocupados:", end=" ")

A = np.zeros(dims, dtype=np.float32)
ia = np.floor((corpo - mn) / VOX).astype(int)
A[ia[:, 0], ia[:, 1], ia[:, 2]] = 1.0
print(int(A.sum()))

# as 24 rotacoes que levam eixo em eixo
ROTS = []
for perm in itertools.permutations(range(3)):
    for sinais in itertools.product([1, -1], repeat=3):
        M = np.zeros((3, 3), dtype=np.float32)
        for i, p in enumerate(perm):
            M[i, p] = sinais[i]
        if abs(np.linalg.det(M) - 1) < 1e-6:
            ROTS.append(M)
print("rotacoes testadas:", len(ROTS))

FA = np.fft.rfftn(A)


def dilatar(V):
    D = V.copy()
    for eixo in range(3):
        D = np.maximum(D, np.roll(V, 1, eixo))
        D = np.maximum(D, np.roll(V, -1, eixo))
    return D


for nome in ORFAS:
    P = carregar(nome)
    P = P - (P.min(0) + P.max(0)) / 2  # centraliza a peca
    melhor = None
    for r, R in enumerate(ROTS):
        Q = P @ R.T
        idx = np.floor((Q - Q.min(0)) / VOX).astype(int)
        forma = idx.max(0) + 1
        if (forma > dims).any():
            continue
        V = np.zeros(dims, dtype=np.float32)
        V[idx[:, 0], idx[:, 1], idx[:, 2]] = 1.0
        D = dilatar(V) - V

        # correlacao: para cada deslocamento, quanto a peca atravessa e encosta
        atravessa = np.fft.irfftn(FA * np.conj(np.fft.rfftn(V)), dims)
        encosta = np.fft.irfftn(FA * np.conj(np.fft.rfftn(D)), dims)
        nota = encosta - 6.0 * atravessa
        t = int(np.argmax(nota))
        ijk = np.unravel_index(t, dims)
        val = float(nota[ijk])
        if melhor is None or val > melhor[0]:
            melhor = (val, r, ijk, float(encosta[ijk]), float(atravessa[ijk]), int(V.sum()))

    val, r, ijk, enc, atr, tot = melhor
    print(f"{nome:22s} nota={val:8.1f}  encosta={enc:7.1f}  atravessa={atr:7.1f}  "
          f"voxels={tot:6d}  rot={r}  desloc={ijk}")
