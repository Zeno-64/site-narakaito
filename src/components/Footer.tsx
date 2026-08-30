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
            className="h-16 w-auto"
            width={617}
            height={606}
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
              <a href="#colecoes" className="transition-colors hover:text-ember-200">
                Coleções
              </a>
            </li>
            <li>
              <a href="#catalogo" className="transition-colors hover:text-ember-200">
                Catálogo
              </a>
            </li>
            <li>
              <a href="#atelie" className="transition-colors hover:text-ember-200">
                Ateliê
              </a>
            </li>
            <li>
              <a href="#sobre" className="transition-colors hover:text-ember-200">
                Sobre
              </a>
            </li>
            <li>
              <a href="#faq" className="transition-colors hover:text-ember-200">
                FAQ
              </a>
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
