import json
import os
import urllib.request

os.chdir("C:/Users/Kevin/AppData/Local/Temp/claude/K--Kevin-workspace-site-narakaito/36e5d92f-40aa-4c4d-aa59-3507aff624df/scratchpad")
idx = json.load(open("stl_index.json"))
os.makedirs("stl", exist_ok=True)

for nome, v in sorted(idx.items(), key=lambda x: x[1]["bytes"]):
    dest = os.path.join("stl", nome)
    if os.path.exists(dest) and os.path.getsize(dest) == v["bytes"]:
        continue
    url = f"https://drive.google.com/uc?export=download&id={v['id']}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            dados = r.read()
        if dados[:15].lower().startswith(b"<!doctype") or b"<html" in dados[:200].lower():
            print("INTERSTICIAL", nome)
            continue
        open(dest, "wb").write(dados)
        print(f"ok {nome} {len(dados)/1048576:.1f} MB", flush=True)
    except Exception as e:
        print("erro", nome, e, flush=True)

print("baixados:", len(os.listdir("stl")))
