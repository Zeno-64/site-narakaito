type Props = {
  eyebrow: string
  title: string
  blurb?: string
  align?: 'left' | 'center'
}

export default function SectionTitle({ eyebrow, title, blurb, align = 'left' }: Props) {
  const centered = align === 'center'
  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="eyebrow text-ember-300">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl text-bone-100 md:text-4xl lg:text-5xl">{title}</h2>
      <span
        aria-hidden
        className={`mt-6 block h-px w-20 bg-ember-500 ${centered ? 'mx-auto' : ''}`}
      />
      {blurb && <p className="mt-6 text-base leading-relaxed text-bone-500">{blurb}</p>}
    </div>
  )
}
