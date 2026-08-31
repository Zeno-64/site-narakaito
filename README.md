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

Cada peça tem um campo `origem`:

- `atelie` — as fotos são da nossa bancada. Aparece no catálogo.
- `modelo` — a imagem é a arte de divulgação do escultor, com marca d'água
  dele. Aparece na Biblioteca de Modelos, e a página mostra o crédito.

Essa separação é proposital: peça com foto de terceiro não deve ser
apresentada como trabalho nosso.

## Imagens

Os originais (~115 MB, fotos e vídeos) ficam em `assets-originais/`, **fora do
git e fora de `public/`** — se estivessem em `public/` iriam inteiros para o
`dist/` a cada deploy.

O que o site serve são versões WebP geradas a partir deles, em
`public/fotos/<peca>/`, em dois tamanhos: `-sm` (560 px, para cards e
miniaturas) e sem sufixo (1200 px, para a foto grande). São ~15 MB no total,
contra 60 MB dos originais.

Para regerar depois de adicionar fotos novas, use o script Python que está no
histórico do commit "Pluga as fotos reais nas seções do site" — ele faz a
ordenação natural dos nomes do WhatsApp, redimensiona e grava os dois tamanhos.

A logo em `public/images/` foi extraída do JPEG original com o fundo removido
por alfa, e separada em marca (`logo-mark`), wordmark (`logo-wordmark`) e
lockup completo (`logo-full`). O header usa marca + wordmark na horizontal
porque o lockup empilhado fica ilegível na altura da barra.

## Pendências

- [ ] **Número do WhatsApp** — hoje é fictício (`5531000000000`), em
      `whatsappUrl` no `site.ts`. Aparece em todos os CTAs do site.
- [ ] **Altura e escala das peças** — estão como "A confirmar" na ficha
      técnica. É o dado que mais pesa na decisão de compra de colecionável, e
      não dá para inventar. Só o Qifrey tem medida real (veio na arte do
      escultor).
- [ ] **Peça da pasta `frieren`** — a pasta foi nomeada assim, mas a escultura
      não é a Frieren. Está no site como "A confirmar", slug
      `peca-a-confirmar`.
- [ ] **Comparador antes/depois** — hoje a imagem de resina é a própria foto
      pintada dessaturada, para garantir alinhamento. Lê como preto e branco,
      não como peça sem pintar. Trocar quando houver o par real: mesma peça no
      tripé, sem mexer no enquadramento, uma antes e outra depois de pintar,
      exportadas quadradas.
- [ ] **Imagens de terceiros** — cinco peças usam a arte de divulgação dos
      escultores (marca d'água do Patreon visível). Substituir por fotos das
      peças pintadas aqui, ou acertar o uso com eles.
- [ ] **Repositório remoto** — ainda não existe. Os outros projetos ficam em
      `github.com/Zeno-64`.
