# Narakaito Lab

Site da Narakaito Lab — colecionáveis em resina impressos em alta resolução e
pintados à mão, sob encomenda.

## Rodar

```bash
npm install
npm run dev
```

## Publicar

```bash
npm run build
npx wrangler deploy
```

O site vive em `narakaito.com` (e `www`), servido pelo Worker
`site-narakaito` — o nome no `wrangler.jsonc` tem que bater com ele, senão o
deploy cria um Worker novo e vazio e o ar continua na versão anterior.

O build gera um HTML por peça em `dist/peca/<slug>/` com as meta tags dela já
dentro do arquivo, e crawler de link (WhatsApp, Instagram, Google) precisa de
URL absoluta em `og:image` e `og:url`. O endereço sai do padrão no topo do
`vite.config.ts`; para testar em outro domínio, `SITE_URL=https://... npm run
build`.

As imagens de card ficam em `public/og/`, em 1200x630 — foto quadrada vira
card pequeno no WhatsApp. Entrou peça nova? Rode uma vez:

```bash
python ferramentas/og/gerar_og.py
```

O `wrangler.jsonc` não tem `main`: são só assets estáticos, então o deploy é
gratuito e sem limite de requisições. O `not_found_handling` está em
`single-page-application` porque as rotas de peça são client-side — sem isso,
abrir `/peca/madara-uchiha` direto no navegador daria 404.

## Stack

React 19, Vite 8, Tailwind 4 (via `@tailwindcss/vite`), Framer Motion 13,
React Router 7, TypeScript 6. Mesma base do `zeno-net` e do `cleduart`.

## Como o conteúdo é organizado

Quase tudo que se edita no dia a dia está em **`src/data/site.ts`**: as peças,
os textos das páginas, a ficha técnica, o FAQ e o número do WhatsApp. Adicionar
uma peça é acrescentar um item em `pecas` — a rota, o card do catálogo e a
página nascem sozinhos a partir dele.

A peça que tem `escultor` mostra o crédito na página, porque a imagem é a arte
de divulgação de quem esculpiu o modelo, com marca d'água dele. Isso é
proposital: peça com foto de terceiro não deve ser apresentada como trabalho
nosso.

A ficha técnica sai de uma de duas funções:

- `fichaOficial(escala, dimensões, montagem, opções?)` — os dados vêm do
  `readme.txt` que acompanha o modelo, e por isso há contagem de peças.
- `fichaMedida(escala, dimensões)` — o modelo veio sem readme, só com a arte
  de medidas (a render com as cotas nas bordas). Dali sai a dimensão exata; a
  escala é calculada pela altura do modelo contra a altura do personagem. Sem
  readme não há contagem de peças.

## Imagens

Os originais (~115 MB, fotos e vídeos) ficam em `assets-originais/`, **fora do
git e fora de `public/`** — se estivessem em `public/` iriam inteiros para o
`dist/` a cada deploy.

O que o site serve são versões WebP geradas a partir deles, em
`public/fotos/<peca>/`, em dois tamanhos: `-sm` (560 px, para cards e
miniaturas) e sem sufixo (1200 px, para a foto grande). São ~15 MB no total,
contra 60 MB dos originais.

Entrou peça nova? Jogue os originais numa pasta por peça, com o mesmo nome que
vai para `public/fotos/`, e rode:

```bash
python ferramentas/fotos/gerar_fotos.py <pasta-de-originais>
python ferramentas/og/gerar_og.py
```

O primeiro faz a ordenação natural, redimensiona e grava os dois tamanhos; o
segundo refaz os cards de link.

Nas pastas do estúdio vem junto uma `*_dimensions.jpg`: **essa não entra no
site**. Ela serve só para tirar a medida do modelo e calcular a escala, que vão
para a ficha da peça no `site.ts`.

Também não entra render em argila cinza — a peça sem pintura nenhuma, só a
malha iluminada. Ela mostra o volume da escultura, mas quem está comprando
quer ver a peça pintada, e no meio da galeria a foto cinza lê como peça que
chegou sem acabamento. **Só vão para o site as fotos do produto pintado.**

O estúdio já separa as duas no nome do arquivo: `*_color (N).jpg` é a pintada
e `*_grey (N).jpg` (às vezes `_gray`) é a de argila. A regra é pegar a série
`_color` inteira e ignorar o resto da pasta.

As fotos vêm do Drive compartilhado, na pasta **3D**, e ela tem dois níveis:
uma pasta por personagem na raiz, com a série completa, e pastas por data
(`15/09`) com os lotes que chegaram depois. A pasta do personagem é a que
manda — foi a que ficou de fora numa primeira importação, e por isso quatro
peças entraram no site com menos da metade das fotos pintadas que existiam.

A logo em `public/images/` foi extraída do JPEG original com o fundo removido
por alfa, e separada em marca (`logo-mark`), wordmark (`logo-wordmark`) e
lockup completo (`logo-full`). O header usa marca + wordmark na horizontal
porque o lockup empilhado fica ilegível na altura da barra.

## Pendências

- [ ] **Número do WhatsApp** — hoje é fictício (`5531000000000`), em
      `whatsappUrl` no `site.ts`. Aparece em todos os CTAs do site.
- [ ] **Altura e escala de três peças** — Link (adulto), Verso e Ken Kaneki
      seguem com "A confirmar" na ficha. É o dado que mais pesa na decisão de
      compra de colecionável, e não dá para inventar: precisa do readme do
      modelo ou da arte de medidas. O resto do catálogo já tem dimensão real.
- [ ] **Peça da pasta `frieren`** — a pasta foi nomeada assim, mas a escultura
      não é a Frieren. Está no site como "A confirmar", slug
      `peca-a-confirmar`.
- [ ] **Comparador antes/depois** — hoje a imagem de resina é a própria foto
      pintada dessaturada, para garantir alinhamento. Lê como preto e branco,
      não como peça sem pintar. Trocar quando houver o par real: mesma peça no
      tripé, sem mexer no enquadramento, uma antes e outra depois de pintar,
      exportadas quadradas.
- [ ] **Imagens de terceiros** — quase todo o catálogo usa a arte de
      divulgação dos escultores (marca d'água do Patreon visível). Substituir
      por fotos das peças pintadas aqui, ou acertar o uso com eles.
- [ ] **Repositório remoto** — ainda não existe. Os outros projetos ficam em
      `github.com/Zeno-64`.
