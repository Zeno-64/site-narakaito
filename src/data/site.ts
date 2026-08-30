export type Product = {
  slug: string
  name: string
  series: string
  /** Pasta em public/images/ com as fotos da peça. Ainda não plugada no card. */
  folder: string
  price?: string
  badges?: string[]
}

/** Peças que já têm foto no ateliê (public/images/<folder>). */
export const products: Product[] = [
  { slug: 'frieren', name: 'Frieren', series: 'Sousou no Frieren', folder: 'frieren', badges: ['Sob encomenda'] },
  { slug: 'sukuna', name: 'Sukuna', series: 'Jujutsu Kaisen', folder: 'sukuna', badges: ['Novidade', 'Sob encomenda'] },
  { slug: 'madara', name: 'Madara Uchiha', series: 'Naruto Shippuden', folder: 'madara', badges: ['Sob encomenda'] },
  { slug: 'link-adulto', name: 'Link Adulto', series: 'The Legend of Zelda', folder: 'link_adulto_zelda', badges: ['Sob encomenda'] },
  { slug: 'link-crianca', name: 'Link Criança', series: 'The Legend of Zelda', folder: 'link_crianca_zelda', badges: ['Sob encomenda'] },
  { slug: 'roy-mustang', name: 'Roy Mustang', series: 'Fullmetal Alchemist', folder: 'roy_mustang', badges: ['Sob encomenda'] },
  { slug: 'mustang-ferido', name: 'Roy Mustang · Ferido', series: 'Fullmetal Alchemist', folder: 'mustang_dodoi', badges: ['Novidade', 'Sob encomenda'] },
  { slug: 'qifrey', name: 'Qifrey', series: 'Witch Hat Atelier', folder: 'qifrey', badges: ['Sob encomenda'] },
]

export const collections = [
  { title: 'Anime & Mangá', caption: 'Coleção', blurb: 'Os personagens que você acompanhou capítulo a capítulo.' },
  { title: 'Games & RPG', caption: 'Coleção', blurb: 'Heróis de console e mesa, do pixel à resina.' },
  { title: 'Sob Medida', caption: 'Coleção', blurb: 'Seu personagem, sua pose, sua paleta. A gente esculpe junto.' },
]

export const differentials = [
  { title: 'Resina Premium', text: 'Resina de alta densidade, curada por UV, com acabamento firme e sem deformar com o tempo.' },
  { title: 'Pintura à Mão', text: 'Aerografia e pincel, camada por camada. Nenhuma peça sai igual à outra.' },
  { title: 'Chega Inteira', text: 'Caixa reforçada, berço interno e proteção individual para viajar o Brasil sem susto.' },
  { title: 'Fala Direto com o Lab', text: 'Do orçamento à entrega, você conversa com quem está pintando a sua peça.' },
]

export const library = [
  { name: 'Frieren', series: 'Sousou no Frieren' },
  { name: 'Sukuna', series: 'Jujutsu Kaisen' },
  { name: 'Madara', series: 'Naruto' },
  { name: 'Link', series: 'The Legend of Zelda' },
  { name: 'Roy Mustang', series: 'Fullmetal Alchemist' },
  { name: 'Qifrey', series: 'Witch Hat Atelier' },
  { name: 'Gojo', series: 'Jujutsu Kaisen' },
  { name: 'Zoro', series: 'One Piece' },
  { name: 'Aloy', series: 'Horizon' },
  { name: 'Geralt', series: 'The Witcher' },
]

export const equipment = [
  { brand: 'Elegoo', model: 'Impressora LCD 16K', text: 'Resolução alta o bastante para preservar cada corte do escultor, fio de cabelo incluso.' },
  { brand: 'Elegoo', model: 'Lavagem & Cura', text: 'Estação de lavagem e cura UV: peça limpa, rígida e estável antes de ver tinta.' },
  { brand: 'Aerógrafo', model: 'Bico 0.2 mm', text: 'Dual-action para os detalhes finos — íris, degradês de pele e sombras suaves.' },
  { brand: 'Aerógrafo', model: 'Bico 0.5 mm', text: 'Coberturas, primer e camadas de base uniformes em superfícies grandes.' },
]

export const faq = [
  {
    q: 'Quanto tempo leva para ficar pronta?',
    a: 'Depende do tamanho e do nível de detalhe. Peças de bancada costumam levar de 2 a 4 semanas entre impressão, acabamento e pintura. O prazo exato sai junto do orçamento.',
  },
  {
    q: 'Dá para pedir um personagem que não está no site?',
    a: 'Dá. Manda o personagem no WhatsApp e a gente verifica se existe modelo disponível ou se vale esculpir sob medida. Também aceitamos referência de pose e paleta.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'Sinal para entrar na fila do ateliê e o restante antes do envio. Parcelamos no cartão; combinamos tudo por mensagem, sem letra miúda.',
  },
  {
    q: 'E se a peça chegar danificada?',
    a: 'Fotografamos a peça embalada antes de despachar. Se acontecer algo no transporte, é só mandar foto na hora da abertura que a gente resolve reparo ou reposição.',
  },
  {
    q: 'Vocês enviam para todo o Brasil?',
    a: 'Sim, para todo o país, com código de rastreio. Em Belo Horizonte e região dá para combinar retirada.',
  },
]

export const whatsappUrl = 'https://wa.me/5531000000000'
