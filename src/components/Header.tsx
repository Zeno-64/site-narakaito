import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { whatsappUrl } from '../data/site'

// com o "/" na frente, funcionam tanto na home quanto dentro de /peca/:slug
const nav = [
  { label: 'Início', href: '/' },
  { label: 'Coleções', href: '/#colecoes' },
  { label: 'Catálogo', href: '/#catalogo' },
  { label: 'O Lab', href: '/#lab' },
  { label: 'Sobre', href: '/#sobre' },
  { label: 'FAQ', href: '/#faq' },
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
      className={`sticky top-0 z-50 border-b border-ink-700 backdrop-blur-md transition-colors duration-300 ${
        solid ? 'bg-ink-950/95' : 'bg-ink-950/75'
      }`}
    >
      {/* Fio de brasa por baixo da barra: separa a navegação do resto da
          página mesmo com o scroll no topo. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-ember-500/70 to-transparent"
      />
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Narakaito Lab, início">
          {/* Lockup horizontal: a chama ao lado do wordmark, para caber na altura do header */}
          <img
            src="/images/logo-mark.png"
            alt=""
            aria-hidden
            className="h-11 w-auto md:h-12"
            width={366}
            height={628}
          />
          <img
            src="/images/logo-wordmark.png"
            alt="Narakaito Lab"
            className="ml-3 h-4 w-auto md:h-[18px]"
            width={752}
            height={81}
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="eyebrow text-bone-300 transition-colors hover:text-ember-200"
            >
              {item.label}
            </Link>
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
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="eyebrow border-b border-ink-800 py-4 text-bone-300"
              >
                {item.label}
              </Link>
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
