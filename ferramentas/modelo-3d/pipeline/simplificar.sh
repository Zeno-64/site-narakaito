#!/bin/bash
cd "C:/Users/Kevin/AppData/Local/Temp/claude/K--Kevin-workspace-site-narakaito/36e5d92f-40aa-4c4d-aa59-3507aff624df/scratchpad"
for f in glb_partes/*.glb; do
  nome=$(basename "$f")
  [ -f "glb_simples/$nome" ] && continue
  npx --yes @gltf-transform/cli@4 simplify "$f" "glb_simples/$nome" --ratio 0.02 --error 0.008 >/dev/null 2>&1
  echo "ok $nome $(stat -c%s "glb_simples/$nome" 2>/dev/null)"
done
echo FIM
