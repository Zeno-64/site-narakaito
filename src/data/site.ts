/** Monta os caminhos das 8 fotos geradas para cada pasta em public/fotos/. */
function fotos(pasta: string, total = 8) {
  return Array.from({ length: total }, (_, i) => {
    const base = `/fotos/${pasta}/${pasta}-${String(i + 1).padStart(2, '0')}`
    return { sm: `${base}-sm.webp`, full: `${base}.webp` }
  })
}

export type Foto = { sm: string; full: string }

export type Product = {
  slug: string
  name: string
  series: string
  fotos: Foto[]
  price?: string
  badges?: string[]
}

/**
 * Peças pintadas no ateliê. Só entram aqui as pastas cujas fotos são da
 * bancada (1080x1350, sem marca d'água de terceiro).
 */
export const products: Product[] = [
  {
    slug: 'madara',
    name: 'Madara Uchiha',
    series: 'Naruto Shippuden',
    fotos: fotos('madara'),
    badges: ['Sob encomenda'],
  },
  {
    slug: 'link-adulto',
    name: 'Link Adulto',
    series: 'The Legend of Zelda',
    fotos: fotos('link_adulto_zelda'),
    badges: ['Sob encomenda'],
  },
  {
    slug: 'link-crianca',
    name: 'Link Criança',
    series: 'The Legend of Zelda',
    fotos: fotos('link_crianca_zelda'),
    badges: ['Novidade', 'Sob encomenda'],
  },
]

/**
 * Modelos que podem ser impressos e pintados sob encomenda. As imagens são os
 * renders promocionais dos escultores (marca d'água do Patreon deles visível),
 * não fotos de peças nossas — por isso ficam na biblioteca e não no catálogo.
 */
export type Modelo = { nome: string; serie: string; escultor: string; foto: Foto }

export const modelos: Modelo[] = [
  { nome: 'Sukuna', serie: 'Jujutsu Kaisen', escultor: 'Michel Rodrigues', foto: fotos('sukuna')[0] },
  { nome: 'Roy Mustang', serie: 'Fullmetal Alchemist', escultor: 'KAI', foto: fotos('roy_mustang')[0] },
  { nome: 'Roy Mustang · Ferido', serie: 'Fullmetal Alchemist', escultor: 'KAI', foto: fotos('mustang_dodoi')[0] },
  { nome: 'Qifrey', serie: 'Witch Hat Atelier', escultor: 'Bulkamancer', foto: fotos('qifrey')[0] },
  // TODO: a pasta veio nomeada "frieren", mas a peça não é a Frieren. Confirmar com o Kevin.
  { nome: 'A confirmar', serie: 'A confirmar', escultor: 'YoruNoAne', foto: fotos('frieren')[0] },
]

/** Peça de destaque do topo: foto do ateliê, sem marca d'água. */
export const destaque = {
  eyebrow: 'Naruto Shippuden · Peça em destaque',
  titulo: 'Madara',
  subtitulo: 'Uchiha',
  texto:
    'Armadura vermelha, gunbai nas costas e a foice cortando o ar em lâmina roxa. Impressa em resina, lixada peça por peça e pintada à mão até o azul da chakra ficar no ponto.',
  foto: fotos('madara')[0],
}

/** Foto usada na seção "Sobre". */
export const fotoAtelie = fotos('link_adulto_zelda')[2]

/**
 * Comparador antes/depois. Atenção: este par são os renders promocionais do
 * escultor (marca d'água "PATREON.COM/BULKAMANCER" e crédito visíveis), não
 * uma peça crua e pintada pela Narakaito. Kevin foi avisado.
 */
export const comparador = {
  cru: '/fotos/comparador/sukuna-resina.webp',
  pintado: '/fotos/comparador/sukuna-pintado.webp',
}

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
