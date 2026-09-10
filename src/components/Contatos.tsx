import type { CSSProperties, ReactNode } from 'react'
import { instagramUrl, whatsappUrl } from '../data/site'

type Atalho = {
  href: string
  rotulo: string
  icone: ReactNode
  /** Cor de fundo do botão: cada rede entra na cor da própria marca. */
  botao: string
  estilo?: CSSProperties
}

/**
 * Degradê oficial do Instagram, do amarelo ao azul. Vai como estilo inline
 * porque é um radial com paradas próprias -- não sai de um utilitário do
 * Tailwind sem virar uma classe só para isto.
 */
const degradeInstagram =
  'radial-gradient(circle at 28% 108%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)'

/** Verde oficial do WhatsApp. */
const verdeWhatsapp = '#25d366'

/** Os dois botões têm o mesmo diâmetro: encostados na mesma margem, tamanhos
 *  diferentes deixam os centros fora de prumo e a coluna parece torta. */
const tamanhoBotao = 'h-14 w-14'

const atalhos: Atalho[] = [
  {
    href: instagramUrl,
    rotulo: 'Instagram',
    botao: `${tamanhoBotao} text-white shadow-ink-950/60 hover:brightness-110`,
    estilo: { backgroundImage: degradeInstagram },
    icone: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="h-7 w-7"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: whatsappUrl,
    rotulo: 'WhatsApp',
    botao: `${tamanhoBotao} text-white shadow-ink-950/60 hover:brightness-110`,
    estilo: { backgroundColor: verdeWhatsapp },
    icone: (
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden>
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.87 9.87 0 0 0 4.74 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.03-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.53 3.69-8.22 8.23-8.22a8.18 8.18 0 0 1 8.21 8.23c0 4.54-3.69 8.21-8.22 8.21Zm4.5-6.15c-.24-.12-1.46-.72-1.68-.8-.23-.09-.39-.13-.56.12-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.04-.39-1.99-1.23-.73-.66-1.23-1.46-1.37-1.71-.15-.24-.02-.38.1-.5.11-.11.25-.29.37-.44.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47c-.16 0-.43.06-.65.3-.22.25-.85.84-.85 2.04s.87 2.37 1 2.53c.12.16 1.72 2.62 4.16 3.68.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.46-.28Z" />
      </svg>
    ),
  },
]

/**
 * Atalhos flutuantes do canto: Instagram em cima, WhatsApp embaixo.
 *
 * Os dois são ícone puro, então cada um carrega um rótulo que aparece ao lado
 * no hover e no foco de teclado -- sem isso, quem não reconhece o desenho não
 * tem como saber para onde o botão leva.
 */
export default function Contatos() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {atalhos.map((atalho) => (
        <a
          key={atalho.rotulo}
          href={atalho.href}
          target="_blank"
          rel="noreferrer"
          aria-label={atalho.rotulo}
          style={atalho.estilo}
          className={`group relative flex items-center justify-center rounded-full shadow-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-300 ${atalho.botao}`}
        >
          <span className="eyebrow pointer-events-none absolute right-full mr-3 whitespace-nowrap border border-ink-700 bg-ink-950/95 px-3 py-1.5 text-[0.625rem] text-bone-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {atalho.rotulo}
          </span>
          {atalho.icone}
        </a>
      ))}
    </div>
  )
}
