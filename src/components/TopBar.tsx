import { whatsappUrl } from '../data/site'

const notices = [
  'Fila de setembro aberta · poucas vagas',
  'Envio para todo o Brasil com rastreio',
  'Parcelamos no cartão',
  'Orçamento sem compromisso no WhatsApp',
]

export default function TopBar() {
  return (
    <div className="border-b border-ink-700 bg-ember-900/40">
      <div className="relative flex overflow-hidden">
        {/* duas cópias lado a lado para o loop não deixar buraco */}
        <div className="marquee-track flex shrink-0 items-center gap-10 whitespace-nowrap py-2 pr-10">
          {[...notices, ...notices].map((notice, i) => (
            <span key={i} className="eyebrow flex items-center gap-3 text-bone-300">
              <span aria-hidden className="text-ember-300">
                ◆
              </span>
              {notice}
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="marquee-track flex shrink-0 items-center gap-10 whitespace-nowrap py-2 pr-10"
        >
          {[...notices, ...notices].map((notice, i) => (
            <span key={i} className="eyebrow flex items-center gap-3 text-bone-300">
              <span className="text-ember-300">◆</span>
              {notice}
            </span>
          ))}
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="eyebrow hidden shrink-0 items-center border-l border-ink-700 bg-ink-900/60 px-5 text-bone-100 transition-colors hover:text-ember-200 md:flex"
        >
          Falar no WhatsApp →
        </a>
      </div>
    </div>
  )
}
