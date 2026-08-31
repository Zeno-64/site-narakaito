# Componentes arquivados

Código que saiu da página ao vivo, mas fica guardado aqui em vez de apagado —
caso a decisão seja revista.

- **Collections.tsx** — seção "Coleções em alta" (Anime & Mangá, Games & RPG,
  Sob Medida). Removida da home a pedido do Kevin em 31/08/2026. Usava
  `collections` de `src/data/site.ts`, que continua lá sem uso.

Nada nesta pasta é importado por nada — o TypeScript não reclama porque
`src/_arquivo` fica fora do grafo de módulos usado pelo build; confirme com
`npm run build` se restaurar algo daqui.
