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
  escultor?: string
  /** Estúdio que assina a escultura, quando há um por trás do escultor. */
  estudio?: string
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
  { rotulo: 'Material', valor: 'Resina JAYO' },
  { rotulo: 'Impressão', valor: 'Creality Halot Mage 8K' },
  { rotulo: 'Pintura', valor: 'Artesanal, com pincéis' },
  { rotulo: 'Prazo', valor: 'Definido no orçamento, conforme tamanho e complexidade' },
  { rotulo: 'Produção', valor: 'São Paulo, SP' },
]

const incluiComum = [
  'A peça pintada à mão e envernizada',
  'As partes separadas, para encaixe ou colagem quando for preciso',
  'Inspeção antes de embalar',
]

const alturaEscala = [
  { rotulo: 'Altura', valor: 'A confirmar' },
  { rotulo: 'Escala', valor: 'A confirmar' },
]

/**
 * Ficha da escultura como vem no readme do estúdio, sem nada inferido.
 *
 * As dimensões são do modelo inteiro, no padrão do arquivo (largura ×
 * profundidade × altura) -- não da base, como estava escrito antes aqui.
 */
function fichaOficial(dimensoes: string, montagem: string, opcoes?: string) {
  return [
    { rotulo: 'Escala', valor: '1/8' },
    { rotulo: 'Dimensões', valor: `${dimensoes} mm (L × P × A)` },
    { rotulo: 'Montagem', valor: montagem },
    ...(opcoes ? [{ rotulo: 'Opções', valor: opcoes }] : []),
    ...fichaComum,
  ]
}

export const pecas: Peca[] = [
  {
    slug: 'madara-uchiha',
    nome: 'Madara Uchiha',
    serie: 'Naruto Shippuden',
    escultor: 'Bionic 3D',
    fotos: fotos('madara', 9),
    badges: ['Sob encomenda'],
    chamada:
      'A pose é a de quem não precisa se mover para dominar o campo: o corpo solto, o olhar baixo e as lâminas de chakra já abertas atrás, como se o combate fosse detalhe.',
    paragrafos: [
      'A composição se organiza em torno da foice, que corta a peça na diagonal e liga o alto da lâmina à base de rocha. Atrás, as lâminas de chakra sobem em leque, e o gunbai fica preso às costas.',
      'A base é rocha com raiz e musgo, e é ela que dá peso à cena: o solo quebrado sugere que a luta já passou por ali.',
    ],
    ficha: [
      { rotulo: 'Escala', valor: '1/6' },
      { rotulo: 'Formato', valor: 'Diorama' },
      { rotulo: 'Dimensões', valor: '308 × 201 × 349 mm (L × P × A)' },
      { rotulo: 'Opções', valor: 'Três cabeças, dois cabelos e três braços' },
      ...fichaComum,
    ],
    inclui: incluiComum,
  },
  {
    slug: 'link-adulto',
    nome: 'Link Adulto',
    serie: 'The Legend of Zelda',
    escultor: 'Bionic 3D',
    fotos: fotos('link_adulto_zelda', 11),
    badges: ['Sob encomenda'],
    chamada:
      'A árvore retorcida, a espada sacada e a fada acesa ao lado: a cena é a do herói no meio da jornada, não a do começo dela.',
    paragrafos: [
      'A escultura arma um cenário inteiro em volta da figura — tronco com folhagem recortada, cogumelos, musgo, a ocarina pendurada e a máscara de pedra encostada na base de tijolo.',
      'O escudo hyliano nas costas e a Master Sword em punho fecham a silhueta, e a fada marca o ponto de luz da composição.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
    inclui: incluiComum,
  },
  {
    slug: 'link-crianca',
    nome: 'Link Criança',
    serie: 'The Legend of Zelda',
    escultor: 'Bionic 3D',
    fotos: fotos('link_crianca_zelda', 12),
    badges: ['Novidade', 'Sob encomenda'],
    chamada:
      'Sentado no toco, ocarina nas mãos e as notas subindo em espiral. É a única peça do catálogo em que nada está acontecendo — e é esse o ponto.',
    paragrafos: [
      'A cena é de pausa: o herói criança concentrado na música, com a fada rodeando as notas que saem do instrumento.',
      'A base combina toco de árvore, pedra e tijolo, com cogumelos ao redor e a lua ao fundo. É o cenário que faz o trabalho que a pose não precisa fazer.',
    ],
    ficha: [
      { rotulo: 'Escala', valor: '1/6' },
      { rotulo: 'Dimensões', valor: '164,91 × 149,22 × 184,25 mm (L × P × A)' },
      { rotulo: 'Montagem', valor: '31 peças na versão Ocarina of Time' },
      { rotulo: 'Opções', valor: "Versão Majora's Mask, com 6 peças" },
      ...fichaComum,
    ],
    inclui: incluiComum,
  },

  // Modelos disponíveis para encomenda. As imagens são as artes de divulgação
  // dos escultores, com a marca d'água deles — por isso o crédito na página.
  {
    slug: 'sukuna',
    nome: 'Sukuna',
    serie: 'Jujutsu Kaisen',
    escultor: 'Michel Rodrigues',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('sukuna', 7),
    badges: ['Novidade', 'Sob encomenda'],
    chamada:
      'A base composta por um crânio com chifres, dentes monstruosos expostos e chamas ascendentes evoca a ideia do Santuário Malevolente (Fukuma Mizushi). O posicionamento de Sukuna no topo desta pilha de restos indica que o sofrimento alheio é literalmente o chão onde ele pisa. Ele é o senhor absoluto do seu próprio inferno.',
    paragrafos: [
      'A pilha de crânios não é só apoio: os chifres, as arcadas expostas e o fogo que sobe entre os ossos montam o cenário, e é dele que a pose tira a altura.',
      'No corpo, as quatro marcas do rosto, os dois pares de olhos e as bocas do tronco são o que identifica o personagem à primeira vista. A escultura tem duas expressões de rosto, e você escolhe qual quer na encomenda.',
    ],
    ficha: fichaOficial('229 × 211 × 330', '40 peças', 'Duas expressões de rosto'),
    inclui: incluiComum,
  },
  {
    slug: 'roy-mustang',
    nome: 'Roy Mustang',
    serie: 'Fullmetal Alchemist',
    escultor: 'KAI',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('roy_mustang', 7),
    badges: ['Sob encomenda'],
    chamada:
      'O estalo dos dedos é a única coisa que ele precisa fazer. O resto da cena — o círculo aceso no chão, o casaco erguido pelo calor — é consequência.',
    paragrafos: [
      'A composição gira em torno do fogo: as chamas nascem na base, sobem em volta das pernas e levantam o casaco, que fica aberto e dá largura à silhueta.',
      'A luva de ignição na mão direita, com o círculo de transmutação bordado, é o detalhe que fecha a leitura do personagem.',
    ],
    ficha: fichaOficial('209 × 164 × 233', '22 peças'),
    inclui: incluiComum,
  },
  {
    slug: 'roy-mustang-ferido',
    nome: 'Roy Mustang · Ferido',
    serie: 'Fullmetal Alchemist',
    escultor: 'KAI',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('mustang_dodoi', 7),
    badges: ['Novidade', 'Sob encomenda'],
    chamada:
      'A mesma alquimia, depois do preço: o uniforme rasgado, o corpo marcado e a postura que insiste em ficar de pé.',
    paragrafos: [
      'Variante da escultura anterior, com o dano da batalha esculpido: o tecido rasga, o torso fica exposto e a pose perde a folga da versão íntegra.',
      'Funciona especialmente bem ao lado da outra, formando um par que conta a passagem da luta na estante.',
    ],
    ficha: fichaOficial('161 × 132 × 237', '21 peças'),
    inclui: incluiComum,
  },
  {
    slug: 'qifrey',
    nome: 'Qifrey',
    serie: 'Witch Hat Atelier',
    escultor: 'Alex Gray',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('qifrey', 8),
    badges: ['Sob encomenda'],
    chamada:
      'O mago em pleno gesto, com o manto girando e o aro da base suspendendo a água. A magia aqui é desenho, e a escultura trata disso.',
    paragrafos: [
      'O chapéu pontudo e o manto em movimento organizam a silhueta na diagonal, e o aro da base fecha a composição por baixo.',
      'É a peça de paleta mais variada do catálogo: verde-água, roxo, amarelo e rosa dividem a mesma escultura.',
    ],
    ficha: fichaOficial('136 × 224 × 286', '37 peças'),
    inclui: incluiComum,
  },
  {
    slug: 'frieren',
    nome: 'Frieren',
    serie: 'Frieren e a Jornada para o Além',
    escultor: 'YoruNoAme',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('frieren', 7),
    badges: ['Sob encomenda'],
    chamada:
      'A maga elfa que atravessou séculos, retratada num instante de calma: o manto aberto, o cajado em arco e nenhuma pressa.',
    paragrafos: [
      'A composição é vertical e limpa. O cajado desenha um arco atrás do corpo, e o manto e a saia ocupam quase toda a superfície da peça.',
      'Duas partes são opcionais: a coroa de flores e o círculo atrás da cabeça. Dá para pedir com as duas, com uma, ou sem nenhuma.',
    ],
    ficha: fichaOficial(
      '145 × 167 × 276',
      '33 peças',
      'Coroa de flores e círculo atrás da cabeça, cada um opcional',
    ),
    inclui: incluiComum,
  },
  {
    slug: 'claire-redfield',
    nome: 'Claire Redfield',
    serie: 'Resident Evil',
    escultor: 'Szymon Szpaczek',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('claire_redfield', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada:
      'Arma em punho no meio da delegacia em ruínas, com o "Let me live" nas costas — a frase que virou assinatura da personagem.',
    paragrafos: [
      'A base reproduz o piso de pedra da delegacia, com brasões em relevo, coluna quebrada e entulho. A cena situa a personagem sem precisar de mais nada.',
      'Nas costas da jaqueta vem o bordado com o anjo alado em relevo. A escultura tem duas expressões de rosto, e você escolhe qual quer na encomenda.',
    ],
    ficha: fichaOficial('120 × 119 × 237', '18 peças', 'Duas expressões de rosto'),
    inclui: incluiComum,
  },
  {
    slug: 'gwen-stacy',
    nome: 'Gwen Stacy',
    serie: 'Marvel · Aranhaverso',
    escultor: 'Lukas Lima e Alex Gray',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('gwen_stacy', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada:
      'Equilibrada num poste da Broadway, o V nos dedos e os pombos como única plateia. A cidade inteira embaixo e nenhuma pressa.',
    paragrafos: [
      'A pose se apoia em uma perna só, sobre o poste com semáforo e as placas de rua. É esse ponto único de contato que dá a sensação de leveza.',
      'A máscara é opcional: dá para receber a peça mascarada ou com o rosto à mostra.',
    ],
    ficha: fichaOficial('164 × 104 × 234', '23 peças', 'Máscara opcional'),
    inclui: incluiComum,
  },
  {
    slug: 'ken-kaneki',
    nome: 'Ken Kaneki',
    serie: 'Tokyo Ghoul',
    escultor: 'Samiho Studios',
    fotos: fotos('kaneki', 7),
    badges: ['Novidade', 'Sob encomenda'],
    chamada:
      'O kagune sobe do ombro e fecha um arco em volta do corpo, enquanto as flores-aranha abrem na base. A peça encena a transformação, não a luta.',
    paragrafos: [
      'A espiral do kagune domina a composição e é o que dá volume à peça. O corpo, em contraste, fica quieto no centro.',
      'Na base, as flores-aranha cercam a rocha — na cultura japonesa, a flor associada à morte e à despedida.',
    ],
    ficha: [
      { rotulo: 'Escala', valor: '1/6' },
      { rotulo: 'Altura', valor: 'A confirmar' },
      ...fichaComum,
    ],
    inclui: incluiComum,
  },
  {
    slug: 'lady-maria',
    nome: 'Lady Maria',
    serie: 'Bloodborne',
    escultor: 'Lora Kolori',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('lady_maria', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada:
      'De pé no alto da torre do relógio, lâmina em punho, guardando o que está atrás dela. A pose é de quem não vai sair do lugar.',
    paragrafos: [
      'A base é a sala hexagonal da torre, com arcos vazados que abrem a composição por baixo e dão profundidade à peça.',
      'O chapéu tricórnio, o casaco longo e a echarpe no pescoço montam a silhueta. O sangue na lâmina é o único detalhe narrativo que a escultura entrega.',
    ],
    ficha: fichaOficial('204 × 132 × 305', '34 peças'),
    inclui: incluiComum,
  },
  {
    slug: 'toph',
    nome: 'Toph',
    serie: 'Avatar · A Lenda de Aang',
    escultor: 'Alex Gray',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('toph', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada:
      'Punho fechado, pé fincado e a rocha subindo do chão em leque. A escultura pega o instante exato entre o golpe e o impacto.',
    paragrafos: [
      'As lascas de pedra saem do solo atrás dela e abrem a composição para os lados, transformando a base em parte da ação.',
      'A máscara é opcional: dá para receber a peça com ou sem ela.',
    ],
    ficha: fichaOficial('113 × 193 × 261', '16 peças', 'Máscara opcional'),
    inclui: incluiComum,
  },
  {
    slug: 'verso',
    nome: 'Verso',
    serie: 'Clair Obscur · Expedition 33',
    escultor: 'Vik3DFigures',
    fotos: fotos('verso', 7),
    badges: ['Novidade', 'Sob encomenda'],
    chamada:
      'De pé, espada baixa, no fim da caminhada. Nenhuma pose de combate — a peça aposta na contenção.',
    paragrafos: [
      'A composição é vertical e fechada: o casaco longo, a faixa na cintura e os cordões no peito formam a silhueta inteira, sem nada saindo para os lados.',
      'A base é rocha baixa e discreta, feita para não competir com a figura.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
    inclui: incluiComum,
  },
]


export function acharPeca(slug: string | undefined) {
  return pecas.find((p) => p.slug === slug)
}

export type Destaque = {
  eyebrow: string
  titulo: string
  /** Segunda linha do nome. Personagem de nome único fica só com a primeira. */
  subtitulo?: string
  texto: string
  foto: Foto
  slug: string
}

/**
 * Monta o destaque a partir da peça, para nome de série e foto de capa não
 * viverem duplicados aqui e na lista.
 */
function destaque(slug: string, titulo: string, subtitulo: string | undefined, texto: string): Destaque {
  const peca = acharPeca(slug)
  if (!peca) throw new Error(`destaque: não existe peça com slug ${slug}`)
  return {
    eyebrow: `${peca.serie} · Peça em destaque`,
    titulo,
    subtitulo,
    texto,
    foto: peca.fotos[0],
    slug,
  }
}

export const destaques: Destaque[] = [
  destaque(
    'sukuna',
    'Ryomen',
    'Sukuna',
    'O Rei das Maldições no alto de uma pilha de crânios, com as chamas subindo entre os ossos. A maior peça do catálogo: 330 mm em escala 1/8.',
  ),
  destaque(
    'frieren',
    'Frieren',
    undefined,
    'A maga elfa em manto claro, com o cajado desenhando um arco atrás do corpo. Coroa de flores e círculo atrás da cabeça são opcionais.',
  ),
  destaque(
    'madara-uchiha',
    'Madara',
    'Uchiha',
    'De pé sobre a rocha, gunbai às costas e a foice traçando um arco largo, com as lâminas de chakra abertas atrás dele.',
  ),
  destaque(
    'roy-mustang',
    'Roy',
    'Mustang',
    'O Alquimista de Chamas no instante do estalo: o círculo aceso no chão e o fogo levantando o casaco.',
  ),
]
export const duracaoDestaque = 7000
/** Foto que ilustra a seção "Sobre". */
export const fotoSobre = pecas[0].fotos[1]

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
  { title: 'Impressão em Resina', text: 'Creality Halot Mage 8K com resina JAYO: é o que reproduz o corte do escultor, detalhe por detalhe.' },
  { title: 'Pintura à Mão', text: 'Pincel, camada por camada. Cor, sombra, luz e detalhe entram um a um — nenhuma peça sai igual à outra.' },
  { title: 'Peça por Peça', text: 'Cada figure é produzida individualmente, do fatiamento do modelo até a embalagem.' },
  { title: 'Direto com Quem Faz', text: 'Operação independente em São Paulo, conduzida pelo próprio criador.' },
]

export const equipment = [
  { brand: 'impressora', model: 'Halot Mage 8K', text: 'A impressora de resina onde a peça nasce. É ela que reproduz o corte do escultor.' },
  { brand: 'resina', model: 'jayo', text: 'A resina usada em tudo que sai daqui.' },
  { brand: 'lavagem e cura', model: 'anycubic', text: 'Lava e cura a peça logo depois da impressão, antes de qualquer preparação de superfície.' },
  { brand: 'pintura', model: '100% artesanal a mão', text: 'Não existe pintura automatizada aqui. Cor, sombra, luz e detalhe entram à mão, um de cada vez.' },
]

export const faq = [
  {
    q: 'Quanto tempo leva para ficar pronta?',
    a: 'Depende do tamanho e da complexidade. Cada peça passa por impressão, lavagem, cura, remoção de suportes, preparação de superfície, primer, pintura à mão, verniz e montagem — e a pintura é a etapa que mais varia. O prazo sai junto do orçamento.',
  },
  {
    q: 'Dá para pedir um personagem que não está no site?',
    a: 'Dá. Manda o personagem no WhatsApp e a gente verifica se existe modelo disponível. Também aceitamos referência de pose e paleta.',
  },
  {
    q: 'A pintura é feita à mão mesmo?',
    a: 'É. Não existe processo automatizado de pintura aqui: cada peça é trabalhada individualmente, com pincel, aplicando cor, sombra, luz e detalhe. É por isso que nenhuma sai idêntica à outra.',
  },
  {
    q: 'O que eu recebo, exatamente?',
    a: 'Uma peça física pintada à mão e envernizada, pronta para exposição e coleção — e não uma impressão 3D recém-tirada da máquina.',
  },
  {
    q: 'A peça chega montada?',
    a: 'Não. Ela vai em partes, para encaixe ou colagem quando for preciso. As esculturas são divididas em muitas peças justamente para caber na impressora, e algumas passam de trinta.',
  },
  {
    q: 'As fotos são da peça que eu vou receber?',
    a: 'Não. As imagens do site são a arte de divulgação de quem esculpiu cada modelo. A sua é impressa e pintada aqui, uma de cada vez — então existe variação natural entre uma peça e outra.',
  },
  {
    q: 'Posso pedir uma pintura diferente da foto?',
    a: 'Pode. Manda a referência no WhatsApp junto do pedido: como a pintura é feita à mão, peça por peça, dá para ajustar paleta e acabamento.',
  },
  {
    q: 'Qual é o tamanho das peças?',
    a: 'Varia. A ficha de cada peça traz escala e dimensões; a maior parte é escala 1/8, entre 23 e 33 cm de altura.',
  },
  {
    q: 'Como funcionam pagamento e envio?',
    a: 'Combinamos por mensagem, junto do orçamento. A produção fica em São Paulo.',
  },
]

export const whatsappUrl = 'https://wa.me/5511978391110'
export const instagramUrl = 'https://www.instagram.com/narakaitolab/'

/** Link de WhatsApp já com a peça escrita na mensagem. */
export function whatsappPeca(nome: string) {
  const texto = `Olá! Tenho interesse na peça ${nome}. Pode me passar o orçamento?`
  return `${whatsappUrl}?text=${encodeURIComponent(texto)}`
}
