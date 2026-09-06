"""Leitura de GLB (o subconjunto que a gente mesmo gera)."""
import json
import struct

import numpy as np

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




def ler_glb_multi(caminho):
    """Igual ao ler_glb, mas devolve todas as primitivas (pos, idx, cor)."""
    import json as _json, struct as _struct
    d = open(caminho, "rb").read()
    js_len = _struct.unpack("<I", d[12:16])[0]
    js = _json.loads(d[20:20 + js_len].decode("utf-8"))
    resto = d[20 + js_len:]
    bin_len = _struct.unpack("<I", resto[0:4])[0]
    binario = resto[8:8 + bin_len]

    def acessor(i):
        a = js["accessors"][i]
        bv = js["bufferViews"][a["bufferView"]]
        off = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
        comp = COMPS[a["type"]]
        dt = np.dtype(TIPOS[a["componentType"]])
        passo = bv.get("byteStride")
        if passo and passo != comp * dt.itemsize:
            cru = np.frombuffer(binario, dtype=np.uint8, count=passo * a["count"], offset=off)
            cru = cru.reshape(a["count"], passo)[:, :comp * dt.itemsize]
            arr = np.frombuffer(np.ascontiguousarray(cru).tobytes(), dtype=dt).reshape(a["count"], comp)
        else:
            arr = np.frombuffer(binario, dtype=dt, count=a["count"] * comp, offset=off).reshape(a["count"], comp)
        if a.get("normalized"):
            arr = arr.astype(np.float32) / np.iinfo(arr.dtype).max
        return arr

    saida = []
    for prim in js["meshes"][0]["primitives"]:
        pos = acessor(prim["attributes"]["POSITION"]).astype(np.float32)
        idx = acessor(prim["indices"]).ravel().astype(np.int64).reshape(-1, 3)
        mat = js["materials"][prim.get("material", 0)]
        cor = mat["pbrMetallicRoughness"].get("baseColorFactor", [0.8, 0.8, 0.8, 1])[:3]
        saida.append((pos, idx, np.array(cor, dtype=np.float32)))
    return saida
