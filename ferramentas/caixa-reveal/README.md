# Seção da caixa — arquivada

A revelação da caixa que abria conforme o scroll e mostrava a peça saindo de
dentro. **Fora do site desde setembro de 2026**, guardada aqui para voltar
quando houver um modelo 3D que valha a pena mostrar.

Nada nesta pasta entra no build: o Vite só empacota `src/` e `public/`.

| arquivo | o que é |
| --- | --- |
| `CaixaReveal.tsx` | o componente inteiro, como saiu do site |
| `caixa.css` | as classes `.caixa-*`, retiradas do fim do `src/index.css` |

---

## Como religar

1. Mover `CaixaReveal.tsx` para `src/components/`.
2. Colar o conteúdo de `caixa.css` no fim do `src/index.css`. São classes
   soltas, não dependem de camada do Tailwind.
3. Em `src/pages/Home.tsx`, importar e pôr de volta entre `<Catalog />` e
   `<Library />` — era essa a posição.

A `.foto-sangrada` **não** está no `caixa.css` de propósito: ela continua viva
no `src/index.css`, usada pelo hero.

---

## Como a coisa funciona

Caixa em CSS 3D, sem WebGL. Um "chão" no plano da cena e quatro paredes
dobradas 90° a partir das arestas dele, cada uma com `transform-origin` na
própria dobra. A tampa é filha da parede de trás e gira de −90° (fechada,
deitada sobre a boca) até +18° (aberta, tombada para trás).

As medidas vivem no CSS — cena de 460 × 320, paredes de 168 de altura — e a
inclinação da câmera é uma constante no componente (`INCLINACAO = 62`).

O movimento todo sai de um `useScroll` sobre a seção, amortecido por um
`useSpring`. A seção tem `h-[240vh]` e um filho `sticky top-0 h-screen`: é a
altura extra que dá espaço de rolagem para a animação acontecer com a cena
parada na tela.

### A linha do tempo

Tudo em fração do progresso 0 → 1:

| trecho | o que acontece |
| --- | --- |
| 0,02 → 0,22 | tampa e lingueta abrem |
| 0,16 → 0,28 | a peça aparece |
| 0,16 → 0,62 | a peça sobe e cresce |
| 0,40 → 0,56 | a caixa se dissolve |
| 0,58 → 0,72 | o texto entra |
| 0,72 | marca a revelação como vista |

### Três detalhes que custaram caro

**A peça fica fora da `.caixa-corpo`, como irmã.** Se estivesse dentro, sumiria
junto quando a caixa se dissolve. E ela contra-gira a inclinação da cena
(`rotateX(-${cena}deg)`) para encarar a câmera em vez de deitar com o palco.

**A revelação não repete.** Uma variável de módulo — não `sessionStorage` —
guarda que já foi vista. Assim, navegar para uma página de peça e voltar mostra
a seção já aberta, sem obrigar a rolar tudo de novo; e um F5 reinicia, porque o
bundle é reexecutado do zero. `sessionStorage` sobreviveria ao F5, que era
exatamente o contrário do pedido.

**A decisão é lida uma vez, na montagem, e não é estado reativo.** Trocar para a
versão estática no meio da rolagem encolhia a seção de 240vh para uma tela de
uma vez: a página inteira subia debaixo do usuário e o scroll caía lá embaixo.
O `useMotionValueEvent` marca a variável de módulo sem re-renderizar.

---

## Se voltar com modelo 3D

O componente que punha um modelo por cima desta caixa está em
[`../modelo-3d/`](../modelo-3d/README.md), junto dos dois `.glb` do Madara e do
pipeline que os gerou a partir dos STL.

O ponto que decide o projeto: **canvas e CSS 3D não se intercalam**. O canvas é
sempre uma camada inteira na frente, então não dá para a peça ser escondida
pelas paredes da caixa. Na tentativa anterior a ilusão veio de um `clip-path`
preso à boca da caixa — o `ref` na `div.caixa-frente` existia só para isso.

Se a ideia voltar, vale decidir antes entre os dois caminhos:

- **manter a caixa em CSS** e recortar o canvas, como estava; ou
- **levar a cena inteira para WebGL**, o que dá oclusão de verdade, sombra e
  reflexo, mas joga fora esta caixa e a animação toda.
