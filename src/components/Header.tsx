import { useEffect, useState } from 'react'
import { whatsappUrl } from '../data/site'

const nav = [
  { label: 'Início', href: '#topo' },
  { label: 'Coleções', href: '#colecoes' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Ateliê', href: '#atelie' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'FAQ', href: '#faq' },
]

export default function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        solid
          ? 'border-ink-700 bg-ink-950/92 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <a href="#topo" className="flex shrink-0 items-center" aria-label="Narakaito Lab, início">
          {/* Lockup horizontal: a chama ao lado do wordmark, para caber na altura do header */}
          <img
            src="/images/logo-mark.png"
            alt=""
            aria-hidden
            className="h-11 w-auto md:h-12"
            width={512}
            height={512}
          />
          <img
            src="/images/logo-wordmark.png"
            alt="Narakaito Lab"
            className="ml-3 h-6 w-auto md:h-7"
            width={593}
            height={124}
          />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="eyebrow text-bone-300 transition-colors hover:text-ember-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="eyebrow hidden border border-ember-500/60 px-5 py-3 text-bone-100 transition-colors hover:bg-ember-700/30 md:inline-block"
          >
            Orçamento
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center border border-ink-600 text-bone-300 lg:hidden"
            aria-expanded={open}
            aria-label="Abrir menu"
          >
            <span aria-hidden>{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink-700 bg-ink-950/98 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-5">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="eyebrow border-b border-ink-800 py-4 text-bone-300"
              >
                {item.label}
              </a>
            ))}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="eyebrow py-4 text-ember-200"
            >
              Falar no WhatsApp →
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
