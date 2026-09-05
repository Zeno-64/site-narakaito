import { Link } from 'react-router-dom'
import { whatsappUrl } from '../data/site'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer id="contato" className="border-t border-ink-800 bg-ink-900">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <img
            src="/images/logo-full.png"
            alt="Narakaito Lab"
            className="h-28 w-auto"
            width={752}
            height={748}
          />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone-500">
            Colecionáveis em resina premium, impressos em alta resolução e pintados à mão,
            peça por peça. Sob encomenda, com envio para todo o Brasil.
          </p>
        </div>

        <div>
          <p className="eyebrow text-bone-100">Navegar</p>
          <ul className="mt-5 space-y-3 text-sm text-bone-500">
            <li>
              <Link to="/#colecoes" className="transition-colors hover:text-ember-200">
                Coleções
              </Link>
            </li>
            <li>
              <Link to="/#catalogo" className="transition-colors hover:text-ember-200">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/#lab" className="transition-colors hover:text-ember-200">
                O Lab
              </Link>
            </li>
            <li>
              <Link to="/#sobre" className="transition-colors hover:text-ember-200">
                Sobre
              </Link>
            </li>
            <li>
              <Link to="/#faq" className="transition-colors hover:text-ember-200">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-bone-100">Falar com a gente</p>
          <ul className="mt-5 space-y-3 text-sm text-bone-500">
            <li>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-ember-200"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-ember-200"
              >
                Instagram
              </a>
            </li>
          </ul>
          <p className="eyebrow mt-8 text-[0.625rem] text-bone-600">
            Envio para todo o Brasil · Parcelamos no cartão
          </p>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <p className="eyebrow text-[0.625rem] text-bone-600">
            © {year} Narakaito Lab · Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
