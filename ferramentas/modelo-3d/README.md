# Madara em 3D — pipeline arquivado

Tentativa de pôr a peça do Madara em 3D saindo da caixa, na seção
`CaixaReveal`. **Está fora do site desde setembro de 2026**, revertida para a
foto a pedido. Tudo o que é preciso para retomar está aqui.

Nada nesta pasta entra no build: o Vite só empacota `src/` e `public/`.

---

## Como estava ligado no site

`PecaTresD.tsx` (nesta pasta) era um componente que entrava dentro do
`CaixaReveal`, num `<canvas>` por cima da caixa em CSS 3D. A seção da caixa
também saiu do site e está em [`../caixa-reveal/`](../caixa-reveal/README.md).

Canvas e CSS 3D não se intercalam — o canvas é sempre uma camada inteira na
frente —, então a ilusão de "sair de dentro da caixa" vinha de um `clip-path`
preso à boca da caixa: tudo abaixo da parede da frente era recortado enquanto o
modelo subia, e o recorte só abria depois que a caixa se dissolvia.

O three.js entrava por `import()` dinâmico e virava chunk separado. Custo
medido no bundle:

| chunk | gzip | quando baixava |
| --- | --- | --- |
| bundle principal | +3,8 KB | sempre |
| three.module | 176,5 KB | só ao chegar na seção da caixa |
| GLTFLoader | 13,1 KB | idem |
| meshopt decoder | 6,0 KB | idem |
| `madara-stl.glb` | 885 KB | idem |

A foto continuava sendo o padrão e só saía de cena quando o modelo avisava que
tinha carregado, então sem WebGL, sem rede ou com `prefers-reduced-motion` a
revelação ficava exatamente como é hoje.

### Para religar

```bash
npm i three @types/three
```

1. Mover `PecaTresD.tsx` de volta para `src/components/`.
2. Mover o `.glb` escolhido para `public/modelos/madara.glb`.
3. No `CaixaReveal.tsx`, refazer quatro coisas (ver o commit `613b260`):
   - `ref` na `div.caixa-frente` (é a boca da caixa, referência do recorte);
   - uma `useMotionValue(1)` multiplicando a opacidade da foto, animada para 0
     no callback `aoFicarPronto`;
   - `<PecaTresD progresso={p} aoFicarPronto={...} boca={parede} />` como irmão
     do `.caixa-palco`;
   - trocar `opacity: pecaOpacidade` por essa opacidade combinada na foto.

---

## Os dois modelos

### `modelos/madara-scan.glb` — 480 KB

Reconstrução fotogramétrica da peça pintada (arquivo que o Kevin gerou).
40k triângulos, **com textura da pintura real** em WebP 1024².

- Prós: tem a pintura de verdade — desgaste, degradês, olhos.
- Contras: geometria mole, rosto macio de perto.

### `modelos/madara-stl.glb` — 885 KB

Reconstruído dos STL de impressão originais. 208.388 triângulos, ~5× a
densidade de malha do outro, mas **sem pintura**: cores chapadas por peça.

- Prós: é a escultura de verdade, silhueta e detalhe corretos.
- Contras: STL não carrega cor, UV nem textura. As cores saem do nome do
  arquivo (`Armor_*` → vermelho, `Hair_*` → preto, `Susanoo_*` → azul
  emissivo, `Base_*`/`Tree` → pedra). Não tem desgaste nem degradê.

---

## O pipeline dos STL

Fonte: pasta do Drive `1jnAM5PVwFP9aje20xPdUPjplfjU5tyTJ` — 41 STL binários,
847 MB, ~17,8 milhões de triângulos. `pipeline/stl_index.json` guarda os ids.

```bash
cd pipeline
python baixar_stl.py                              # 847 MB -> ./stl
python stl_para_glb.py stl glb_partes             # solda vertices, pinta por nome
bash simplificar.sh                               # meshoptimizer a 2% -> glb_simples
python juntar_glb.py glb_simples bruto.glb "$FORA"   # monta num GLB so
npx @gltf-transform/cli optimize bruto.glb final.glb \
    --compress meshopt --simplify false --texture-compress false
```

O `optimize` roda `palette`, que colapsa os 23 materiais chapados em duas
texturas de 64×4 px — o modelo inteiro fica em **2 draw calls**.

`$FORA` é a lista de peças excluídas (ver abaixo).

### Ferramentas de inspeção

Não existe visualizador aqui, então foram escritas do zero:

| arquivo | o que faz |
| --- | --- |
| `glb_io.py` | leitor de GLB. **Respeita `byteStride`** — o gltf-transform intercala POSITION e NORMAL no mesmo bufferView, e ignorar isso faz normal virar posição |
| `previa.py` | projeção de vértices com z-buffer. Instantâneo, serve para conferir montagem |
| `montar_render.py`, `render_multi.py` | rasterizador z-buffer com sombreamento. Lento (minutos), mas mostra superfície |
| `mapa_pecas.py` | contact sheet: cada peça destacada em vermelho contra o resto em cinza. **Foi o que resolveu a montagem** |
| `encaixar.py` | busca de encaixe por correlação FFT (ver "o que não funcionou") |
| `render_obj.py` | rasteriza o OBJ da fotogrametria, do caminho anterior |

---

## As 41 peças: o que entrou e por quê

Duas medições decidiram tudo — palpite por bounding box levou a erro duas
vezes, porque na vista de frente o eixo X do arquivo aponta para a
profundidade.

**Sobreposição de volume por voxel** separa alternativa de peça que só encosta:

- `Head_1`/`Head_2`/`Head_3` se sobrepõem 92% → alternativas, fica a `Head_1`
- `Hair_1_A`/`Hair_2_A` se sobrepõem 81% → alternativas, fica a `Hair_1_A`
- `Hair_1_B`/`Hair_2_B` se sobrepõem 10,9% → **pedaços diferentes da mesma
  juba**, os dois entram
- `Arm_Left_1` (mão com dois dedos para cima) e `Arm_Right_2` (mão aberta)
  disputam o mesmo braço → fica a de dois dedos, escolha do Kevin
- `Sickle_1`/`Sickle_3`/`Sickle_Optional` não se sobrepõem → são os três
  segmentos do cajado. `Sickle_Optional` é o do **meio**, apesar do nome; sem
  ele a foice fica partida em dois tocos no ar

**Grafo de contato** (voxel dilatado) acha o que não encosta em nada:

- 23 peças formam um corpo conectado
- 7 flutuam soltas: `Chain`, `Gunbai_1`, `Gunbai_2`, `Kunai`, `Shuriken1`,
  `Shuriken2`, `Susanoo_5`, mais o `Clothing` (que só toca a foice). No arquivo
  elas ficam num plano ao lado e abaixo da base

### Lista final (23 peças)

```
Arm_Left_1  Arm_right_1  Armor_1  Armor_2  Base_1  Base_2
Hair_1_A  Hair_1_B  Hair_2_B  Hand_1_Optional  Head_1
Shoe_Left  Shoe_Right  Shoulder_armor_Left
Sickle_1  Sickle_3  Sickle_Optional
Susanoo_1  Susanoo_2  Susanoo_3  Susanoo_4
Torso  Tree
```

Excluídas (`$FORA`):

```
Arm_Left_3,Arm_Right_3,Hand_1_Sickle,Legs,Shoulder_armor_Right,Sickle_2,
Head_2,Head_3,Hair_2_A,Arm_Right_2,Chain,Gunbai_1,Gunbai_2,Kunai,
Shuriken1,Shuriken2,Susanoo_5,Clothing
```

---

## O que ficou por fazer

**6 peças vieram reorientadas na origem, para impressão**: `Legs`,
`Arm_Left_3`, `Arm_Right_3`, `Hand_1_Sickle`, `Shoulder_armor_Right`,
`Sickle_2`. Elas pertencem à peça, mas não há como posicioná-las sem
referência de encaixe.

Efeito visível: falta a ombreira direita, e as pernas por baixo do saiote.
As caneleiras e as botas cobrem a região e a silhueta fecha, mas a ausência
é real.

### O que não funcionou

`encaixar.py` tenta achar o encaixe automaticamente: voxeliza o corpo montado,
testa as 24 orientações alinhadas a eixo e, para cada uma, avalia **todas** as
translações de uma vez por correlação FFT, pontuando contato menos
interpenetração.

Não presta. As melhores notas dão 4–15% de contato — o otimizador encosta a
peça em qualquer superfície em vez de assentá-la no soquete. A causa é que
fatiador reorienta peça em ângulo arbitrário, não em múltiplo de 90°, então a
busca por eixo nem alcança a resposta certa. Ampliar para rotações contínuas
seria caro e continuaria sem um critério que distinga "encostado" de
"encaixado".

**O caminho que resolve**: pedir ao escultor o arquivo já montado — um
`.blend`, um OBJ único, ou os STL em posição de display. Com isso o pipeline
daqui roda em poucos minutos e sai completo.

---

## Se um dia quiser a pintura junto da geometria boa

Precisaria de UV unwrap (xatlas) na malha dos STL e bake por projeção da
textura do `madara-scan.glb` em cima. Nenhuma das duas coisas foi feita aqui —
é trabalho de Blender, não de script.
