export type Foto = { sm: string; full: string }

/** Monta os caminhos das fotos geradas para cada pasta em public/fotos/. */
function fotos(pasta: string, total: number): Foto[] {
  return Array.from({ length: total }, (_, i) => {
    const base = `/fotos/${pasta}/${pasta}-${String(i + 1).padStart(2, '0')}`
    return { sm: `${base}-sm.webp`, full: `${base}.webp` }
  })
}

export type Peca = {
  slug: string
  nome: string
  serie: string
  fotos: Foto[]
  /** 'atelie' = fotos da nossa bancada. 'modelo' = arte de divulgação do escultor. */
  origem: 'atelie' | 'modelo'
  escultor?: string
  chamada: string
  paragrafos: string[]
  ficha: { rotulo: string; valor: string }[]
  inclui: string[]
  badges?: string[]
  preco?: string
}

// Ficha que vale para tudo que sai daqui. Altura e escala ficam por peça,
// porque variam — as marcadas como "A confirmar" precisam ser medidas.
const fichaComum = [
  { rotulo: 'Material', valor: 'Resina de alta densidade, curada em UV' },
  { rotulo: 'Pintura', valor: 'À mão: aerógrafo, pincel e lavagem de sombra' },
  { rotulo: 'Impressão', valor: 'LCD 16K' },
  { rotulo: 'Prazo', valor: '2 a 4 semanas após a confirmação' },
  { rotulo: 'Envio', valor: 'Todo o Brasil, com rastreio' },
]

const incluiComum = [
  'A peça montada, pintada e selada',
  'Base cenário já fixada',
  'Caixa reforçada com berço interno',
  'Fotos da peça pronta antes do envio',
]

const alturaEscala = [
  { rotulo: 'Altura', valor: 'A confirmar' },
  { rotulo: 'Escala', valor: 'A confirmar' },
]

export const pecas: Peca[] = [
  {
    slug: 'madara-uchiha',
    nome: 'Madara Uchiha',
    serie: 'Naruto Shippuden',
    origem: 'atelie',
    fotos: fotos('madara', 9),
    badges: ['Sob encomenda'],
    chamada: 'O Uchiha em pose de combate, com a foice em arco e a chakra acesa.',
    paragrafos: [
      'A armadura vermelha é o centro da peça: cada placa foi pintada em camadas, com o desgaste puxado nas quinas para não parecer plástico recém-saído do molde. Por baixo dela, o manto roxo recebe uma lavagem escura nas dobras, que é o que dá volume ao tecido quando a peça está na estante.',
      'A foice desenha um arco que atravessa a composição inteira, com a lâmina em degradê do preto ao branco. Atrás, as lâminas de chakra em resina translúcida azul ficam sem tinta opaca de propósito, para a luz do ambiente atravessar e acender o efeito.',
      'A base é rocha com raiz e musgo, em tons frios para empurrar o vermelho da armadura para a frente. É a peça que melhor mostra o que a pintura à mão faz por uma escultura.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
    inclui: incluiComum,
  },
  {
    slug: 'link-adulto',
    nome: 'Link Adulto',
    serie: 'The Legend of Zelda',
    origem: 'atelie',
    fotos: fotos('link_adulto_zelda', 11),
    badges: ['Sob encomenda'],
    chamada: 'Túnica verde, escudo hyliano e a Master Sword sacada junto da árvore.',
    paragrafos: [
      'O verde da túnica é construído em três camadas: base, sombra nas dobras e luz nas partes altas do tecido. É o que separa uma peça pintada à mão de uma pintada por spray — de longe você vê o volume do pano, não uma mancha só de cor.',
      'O escudo traz o brasão pintado à mão livre, e a espada recebe acabamento metálico no fio com a guarda em azul. A fada acompanha a composição em resina translúcida, acesa por dentro.',
      'A base é uma cena inteira: árvore com folhagem recortada, cogumelos, musgo, a ocarina pendurada e a máscara de pedra encostada. São dezenas de pontos de tinta separados, e é onde mais se gasta tempo.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
    inclui: incluiComum,
  },
  {
    slug: 'link-crianca',
    nome: 'Link Criança',
    serie: 'The Legend of Zelda',
    origem: 'atelie',
    fotos: fotos('link_crianca_zelda', 12),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'Sentado no toco, ocarina nas mãos e as notas saindo em luz azul.',
    paragrafos: [
      'É a peça mais silenciosa do catálogo, e por isso a mais difícil de acertar. Sem pose de luta para chamar atenção, tudo depende do rosto e das mãos: a expressão de quem está concentrado tocando, e os dedos posicionados nos furos da ocarina.',
      'As notas musicais e a fada são resina translúcida azul, sem pigmento opaco, para captarem a luz do ambiente. Contra o verde da túnica e o marrom do toco, é esse azul que puxa o olho para o centro da peça.',
      'A base combina toco de árvore, pedra e tijolo, cada material com textura e tom próprios. Os cogumelos são pintados um a um, com os pontos brancos aplicados na ponta do pincel.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
    inclui: incluiComum,
  },

  // Modelos disponíveis para encomenda. As imagens são as artes de divulgação
  // dos escultores, com a marca d'água deles — por isso o crédito na página.
  {
    slug: 'sukuna',
    nome: 'Sukuna',
    serie: 'Jujutsu Kaisen',
    origem: 'modelo',
    escultor: 'Michel Rodrigues',
    fotos: fotos('sukuna', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'O Rei das Maldições sobre o crânio, com o fogo subindo da base.',
    paragrafos: [
      'Escultura com muita pele exposta, o que torna a peça um exercício de degradê: o tom precisa variar do músculo à sombra sem marcar transição. As marcas pretas do rosto e do tronco entram depois, à mão livre, e é onde a peça ganha ou perde a semelhança.',
      'A base traz crânios, a arcada e as chamas esculpidas, que pintamos em laranja quente com as pontas puxadas ao branco para simular incandescência.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
    inclui: incluiComum,
  },
  {
    slug: 'roy-mustang',
    nome: 'Roy Mustang',
    serie: 'Fullmetal Alchemist',
    origem: 'modelo',
    escultor: 'KAI',
    fotos: fotos('roy_mustang', 8),
    badges: ['Sob encomenda'],
    chamada: 'O Alquimista de Chamas com o estalo aceso na ponta dos dedos.',
    paragrafos: [
      'O uniforme azul-escuro é o desafio: azul escuro engole detalhe se for pintado chapado, então vai em camadas, com realce nas dobras e nos vivos dourados do casaco.',
      'O círculo no chão e a chama na mão são pintados como fonte de luz, com o calor subindo pelo tecido — é o que amarra a peça e faz o fogo parecer aceso de verdade.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
    inclui: incluiComum,
  },
  {
    slug: 'roy-mustang-ferido',
    nome: 'Roy Mustang · Ferido',
    serie: 'Fullmetal Alchemist',
    origem: 'modelo',
    escultor: 'KAI',
    fotos: fotos('mustang_dodoi', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'A versão marcada pela batalha, para quem prefere a cena dramática.',
    paragrafos: [
      'Variante da escultura anterior, com o dano da batalha esculpido. Pede uma pintura mais suja: o uniforme perde o brilho, ganha poeira nas partes baixas e o tecido rasgado recebe fiapos pintados um a um.',
      'Funciona especialmente bem ao lado da versão íntegra, formando um par que conta a passagem da luta na estante.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
    inclui: incluiComum,
  },
  {
    slug: 'qifrey',
    nome: 'Qifrey',
    serie: 'Witch Hat Atelier',
    origem: 'modelo',
    escultor: 'Bulkamancer',
    fotos: fotos('qifrey', 8),
    badges: ['Sob encomenda'],
    chamada: 'O mago de chapéu com o manto em movimento e a paleta mais colorida do catálogo.',
    paragrafos: [
      'A peça mais colorida que oferecemos, e uma das mais divertidas de pintar: verde-água, roxo, amarelo e rosa dividem a mesma escultura sem nenhuma poder vazar na outra. Exige máscara e paciência entre camadas.',
      'O manto em movimento e a base circular com relevo dão bastante superfície para trabalhar sombra, o que faz a peça render muito bem em foto e em estante iluminada.',
    ],
    ficha: [
      { rotulo: 'Altura', valor: '276 mm' },
      { rotulo: 'Base', valor: '167 × 145 mm' },
      ...fichaComum,
    ],
    inclui: incluiComum,
  },
  {
    slug: 'peca-a-confirmar',
    nome: 'A confirmar',
    serie: 'A confirmar',
    origem: 'modelo',
    escultor: 'YoruNoAne',
    fotos: fotos('frieren', 8),
    badges: ['Sob encomenda'],
    chamada: 'Peça com coroa de flores e foice, em paleta clara.',
    paragrafos: [
      'Escultura de paleta clara e composição vertical, com bastante superfície lisa — o tipo de peça em que o acabamento aparece, porque não há textura para esconder falha de lixa.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
    inclui: incluiComum,
  },
]

export const products = pecas.filter((p) => p.origem === 'atelie')
export const modelos = pecas.filter((p) => p.origem === 'modelo')

export function acharPeca(slug: string | undefined) {
  return pecas.find((p) => p.slug === slug)
}

export type Destaque = {
  eyebrow: string
  titulo: string
  subtitulo: string
  texto: string
  foto: Foto
  slug: string
}

export const destaques: Destaque[] = [
  {
    eyebrow: 'Naruto Shippuden · Peça em destaque',
    titulo: 'Madara',
    subtitulo: 'Uchiha',
    texto:
      'Armadura vermelha, gunbai nas costas e a foice cortando o ar em lâmina roxa. Impressa em resina, lixada peça por peça e pintada à mão até o azul da chakra ficar no ponto.',
    foto: products[0].fotos[0],
    slug: products[0].slug,
  },
  {
    eyebrow: 'The Legend of Zelda · Peça em destaque',
    titulo: 'Link',
    subtitulo: 'Adulto',
    texto:
      'Túnica verde, escudo hyliano nas costas e a Master Sword sacada junto da árvore. Base cheia de folha, cogumelo e musgo, tudo pintado fio a fio.',
    foto: products[1].fotos[0],
    slug: products[1].slug,
  },
  {
    eyebrow: 'The Legend of Zelda · Peça em destaque',
    titulo: 'Link',
    subtitulo: 'Criança',
    texto:
      'Sentado no toco, ocarina nas mãos e as notas saindo em luz azul. Uma peça silenciosa no meio de tanta pose de luta — e das mais difíceis de pintar.',
    foto: products[2].fotos[0],
    slug: products[2].slug,
  },
]

export const duracaoDestaque = 7000
export const fotoAtelie = products[1].fotos[2]

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

/** Link de WhatsApp já com a peça escrita na mensagem. */
export function whatsappPeca(nome: string) {
  const texto = `Olá! Tenho interesse na peça ${nome}. Pode me passar o orçamento?`
  return `${whatsappUrl}?text=${encodeURIComponent(texto)}`
}
