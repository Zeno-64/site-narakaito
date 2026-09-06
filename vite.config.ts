import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { pecas } from './src/data/site.ts'

// Domínio de produção. Crawler de link não resolve caminho relativo de forma
// confiável -- og:image e og:url precisam ser absolutos, então este endereço
// tem que estar certo. Dá para sobrescrever no deploy com SITE_URL=...
const SITE = (process.env.SITE_URL ?? 'https://narakaito-lab.workers.dev').replace(/\/+$/, '')

const escapar = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

type Meta = { titulo: string; descricao: string; imagem: string; url: string; alt: string }

/**
 * Troca o `content` de uma meta tag achada pelo atributo que a identifica.
 *
 * `[^>]*` em vez de espaço literal porque as tags do index.html são
 * multi-linha -- e classe negada atravessa quebra de linha, ao contrário do
 * ponto. Se a tag não for encontrada o build para: uma substituição que falha
 * calada publicaria o site inteiro com a meta errada, que é bem pior do que
 * um build vermelho.
 */
function trocarMeta(html: string, atributo: string, conteudo: string) {
  const alvo = new RegExp(`(<meta[^>]*${atributo}[^>]*content=")[^"]*(")`, 'i')
  if (!alvo.test(html)) {
    throw new Error(`meta-por-peca: não achei a tag ${atributo} no index.html`)
  }
  return html.replace(alvo, `$1${escapar(conteudo)}$2`)
}

function aplicarMeta(html: string, meta: Meta) {
  if (!/<title>[^<]*<\/title>/.test(html)) {
    throw new Error('meta-por-peca: não achei o <title> no index.html')
  }
  let cabeca = html.replace(/<title>[^<]*<\/title>/, `<title>${escapar(meta.titulo)}</title>`)
  cabeca = trocarMeta(cabeca, 'name="description"', meta.descricao)
  cabeca = trocarMeta(cabeca, 'property="og:title"', meta.titulo)
  cabeca = trocarMeta(cabeca, 'property="og:description"', meta.descricao)
  cabeca = trocarMeta(cabeca, 'property="og:image"', meta.imagem)

  const extras = [
    `<link rel="canonical" href="${meta.url}" />`,
    `<meta property="og:url" content="${meta.url}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapar(meta.alt)}" />`,
  ].join('\n    ')

  return cabeca.replace('</head>', `  ${extras}\n  </head>`)
}

/**
 * Escreve um HTML por peça, com as meta tags dela já no arquivo.
 *
 * O site é uma SPA: o `definirMeta` só troca título e descrição depois que o
 * JS roda, e crawler de link (WhatsApp, Instagram, Google) não roda JS. Sem
 * isto, todo link de peça compartilhado mostra o título genérico do site e a
 * logo -- nunca a foto da peça, que é o que faz alguém abrir.
 *
 * O HTML gerado é o mesmo `index.html` com a cabeça trocada, então o React
 * monta normalmente e a navegação client-side continua igual.
 */
function metaPorPeca(): Plugin {
  let destino = 'dist'

  return {
    name: 'meta-por-peca',
    apply: 'build',
    configResolved(config) {
      destino = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const base = resolve(destino, 'index.html')
      if (!existsSync(base)) return
      const modelo = readFileSync(base, 'utf8')

      for (const peca of pecas) {
        // A imagem de card vem de ferramentas/og/gerar_og.py. Se a peça é nova
        // e ninguém rodou o script, cai na logo em vez de quebrar o preview.
        const card = `og/${peca.slug}.jpg`
        const imagem = existsSync(resolve(destino, card))
          ? `${SITE}/${card}`
          : `${SITE}/images/logo.jpeg`

        const html = aplicarMeta(modelo, {
          // mesmos textos que o definirMeta usa na página, para o que o
          // crawler lê e o que o visitante vê não divergirem
          titulo: `${peca.nome} — ${peca.serie} em resina pintada à mão · Narakaito Lab`,
          descricao: `${peca.chamada} Impressa em resina premium e pintada à mão sob encomenda, com envio para todo o Brasil.`,
          imagem,
          url: `${SITE}/peca/${peca.slug}`,
          alt: `${peca.nome} — peça em resina pintada à mão`,
        })

        const arquivo = resolve(destino, 'peca', peca.slug, 'index.html')
        mkdirSync(dirname(arquivo), { recursive: true })
        writeFileSync(arquivo, html)
      }

      // a home também ganha url canônica e imagem absoluta
      writeFileSync(
        base,
        trocarMeta(modelo, 'property="og:image"', `${SITE}/images/logo.jpeg`).replace(
          '</head>',
          `  <link rel="canonical" href="${SITE}/" />\n    <meta property="og:url" content="${SITE}/" />\n  </head>`,
        ),
      )

      console.log(`meta-por-peca: ${pecas.length} páginas de peça geradas em ${SITE}`)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), metaPorPeca()],
})
