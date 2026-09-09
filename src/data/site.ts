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
  /** 'lab' = fotos da nossa bancada. 'modelo' = arte de divulgação do escultor. */
  origem: 'lab' | 'modelo'
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
  { rotulo: 'Material', valor: 'Resina JAYO, lavada e curada em UV' },
  { rotulo: 'Impressão', valor: 'Creality Halot Mage 8K' },
  { rotulo: 'Pintura', valor: 'À mão, com pincel — sem processo automatizado' },
  { rotulo: 'Prazo', valor: 'Definido no orçamento, conforme tamanho e complexidade' },
  { rotulo: 'Produção', valor: 'São Paulo, SP' },
]

const incluiComum = [
  'A peça montada, pintada à mão e envernizada',
  'Pintura aplicada peça por peça, sem processo automatizado',
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
    origem: 'lab',
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
    origem: 'lab',
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
    origem: 'lab',
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
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('sukuna', 7),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'O Rei das Maldições sobre o crânio, com o fogo subindo da base.',
    paragrafos: [
      'Escultura de Michel Rodrigues para o Bulkamancer Sculpts, em escala 1/8 e 330 mm de altura. O kit vem em 40 peças, montadas, lixadas e pintadas uma a uma aqui no Lab.',
      'É uma escultura de muita pele exposta, o que a torna um exercício de degradê: o tom precisa variar do músculo à sombra sem marcar transição. As marcas pretas do rosto e do tronco entram depois, à mão livre, e é onde a peça ganha ou perde a semelhança.',
      'O escultor entrega duas expressões de rosto. Você escolhe qual quer na hora da encomenda.',
    ],
    ficha: fichaOficial('229 × 211 × 330', '40 peças', 'Duas expressões de rosto'),
    inclui: incluiComum,
  },
  {
    slug: 'roy-mustang',
    nome: 'Roy Mustang',
    serie: 'Fullmetal Alchemist',
    origem: 'modelo',
    escultor: 'KAI',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('roy_mustang', 7),
    badges: ['Sob encomenda'],
    chamada: 'O Alquimista de Chamas com o estalo aceso na ponta dos dedos.',
    paragrafos: [
      'Escultura de KAI para o Bulkamancer Sculpts, em escala 1/8 e 233 mm de altura, montada a partir de 22 peças.',
      'O uniforme azul-escuro é o desafio: azul escuro engole detalhe se for pintado chapado, então vai em camadas, com realce nas dobras e nos vivos dourados do casaco.',
      'A chama na mão e o fogo da base são pintados como fonte de luz, com o calor subindo pelo tecido — é o que amarra a peça e faz o fogo parecer aceso.',
    ],
    ficha: fichaOficial('209 × 164 × 233', '22 peças'),
    inclui: incluiComum,
  },
  {
    slug: 'roy-mustang-ferido',
    nome: 'Roy Mustang · Ferido',
    serie: 'Fullmetal Alchemist',
    origem: 'modelo',
    escultor: 'KAI',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('mustang_dodoi', 7),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'A versão marcada pela batalha, para quem prefere a cena dramática.',
    paragrafos: [
      'Variante da escultura anterior, também de KAI, com o dano da batalha esculpido. Escala 1/8, 237 mm de altura e 21 peças.',
      'Pede uma pintura mais suja: o uniforme perde o brilho, ganha poeira nas partes baixas e o tecido rasgado recebe fiapos pintados um a um.',
      'Funciona especialmente bem ao lado da versão íntegra, formando um par que conta a passagem da luta na estante.',
    ],
    ficha: fichaOficial('161 × 132 × 237', '21 peças'),
    inclui: incluiComum,
  },
  {
    slug: 'qifrey',
    nome: 'Qifrey',
    serie: 'Witch Hat Atelier',
    origem: 'modelo',
    escultor: 'Alex Gray',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('qifrey', 8),
    badges: ['Sob encomenda'],
    chamada: 'O mago de chapéu com o manto em movimento e a paleta mais colorida do catálogo.',
    paragrafos: [
      'Escultura de Alex Gray para o Bulkamancer Sculpts, em escala 1/8 e 286 mm de altura, em 37 peças.',
      'A peça mais colorida que oferecemos, e uma das mais divertidas de pintar: verde-água, roxo, amarelo e rosa dividem a mesma escultura sem nenhuma poder vazar na outra. Exige máscara e paciência entre camadas.',
      'O chapéu pontudo e o manto em movimento dão bastante superfície para trabalhar sombra, o que faz a peça render bem em estante iluminada.',
    ],
    ficha: fichaOficial('136 × 224 × 286', '37 peças'),
    inclui: incluiComum,
  },
  {
    slug: 'frieren',
    nome: 'Frieren',
    serie: 'Frieren e a Jornada para o Além',
    origem: 'modelo',
    escultor: 'YoruNoAme',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('frieren', 7),
    badges: ['Sob encomenda'],
    chamada: 'A maga elfa de manto claro, com o cajado em arco atrás do corpo.',
    paragrafos: [
      'Escultura de YoruNoAme para o Bulkamancer Sculpts, em escala 1/8 e 276 mm de altura, em 33 peças.',
      'É a peça de paleta mais clara que oferecemos, e por isso a mais implacável: branco e prata não escondem nada, então cada risco de lixa precisa sumir antes da primeira camada de tinta.',
      'Duas partes são opcionais e ficam a seu critério: a coroa de flores e o círculo atrás da cabeça. Dá para pedir com as duas, com uma, ou sem nenhuma.',
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
    origem: 'modelo',
    escultor: 'Szymon Szpaczek',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('claire_redfield', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'Jaqueta de couro vermelha, pistola em punho e o "Let me live" nas costas.',
    paragrafos: [
      'Escultura de Szymon Szpaczek para o Bulkamancer Sculpts, em escala 1/8 e 237 mm de altura, em 18 peças.',
      'A jaqueta é o centro da peça: vermelho de couro montado em camadas, com verniz seletivo só nas partes altas. É o que separa couro de plástico pintado de vermelho quando a luz da estante bate.',
      'Nas costas vem o "Let me live" com o anjo alado em relevo, pintado à mão livre. O escultor entrega duas expressões de rosto — você escolhe na encomenda.',
    ],
    ficha: fichaOficial('120 × 119 × 237', '18 peças', 'Duas expressões de rosto'),
    inclui: incluiComum,
  },
  {
    slug: 'gwen-stacy',
    nome: 'Gwen Stacy',
    serie: 'Marvel · Aranhaverso',
    origem: 'modelo',
    escultor: 'Lukas Lima e Alex Gray',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('gwen_stacy', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'Equilibrada no poste da Broadway, com o V nos dedos.',
    paragrafos: [
      'Escultura de Lukas Lima e Alex Gray para o Bulkamancer Sculpts, em escala 1/8 e 234 mm de altura, em 23 peças.',
      'O traje é branco, preto e um rosa que precisa cair exatamente no tom: o rosa da Gwen é marca registrada e denuncia qualquer erro de mistura. As faixas correm do capuz até o pé, e cada uma é mascarada e pintada separada da vizinha.',
      'A pose se apoia em uma perna só, sobre o poste com semáforo e as placas de rua. A máscara é opcional: dá para receber a peça mascarada ou com o rosto à mostra.',
    ],
    ficha: fichaOficial('164 × 104 × 234', '23 peças', 'Máscara opcional'),
    inclui: incluiComum,
  },
  {
    slug: 'ken-kaneki',
    nome: 'Ken Kaneki',
    serie: 'Tokyo Ghoul',
    origem: 'modelo',
    escultor: 'Samiho Studios',
    fotos: fotos('kaneki', 7),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'Cabelo branco, olho de ghoul e o kagune fechando um arco vermelho atrás do corpo.',
    paragrafos: [
      'O kagune domina a composição: uma espiral que sobe do ombro e dá a volta na figura inteira. Vai em resina translúcida com pigmento no lugar de tinta opaca, para a luz atravessar e o vermelho acender por dentro em vez de ficar chapado.',
      'O contraste é o motor da peça — cabelo branco, roupa escura, pele fria — com o kagune e as flores-aranha da base como únicas cores quentes. É uma paleta curta, o que deixa cada erro de tom muito visível.',
      'No rosto, um olho fica humano e o outro recebe a esclera preta com íris vermelha, pintados com pincel de dois fios. É essa assimetria que conta a história do personagem, e é o último detalhe a entrar na peça.',
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
    origem: 'modelo',
    escultor: 'Lora Kolori',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('lady_maria', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'Chapéu tricórnio, lâmina em punho e a sala da torre do relógio sob os pés.',
    paragrafos: [
      'Escultura de Lora Kolori para o Bulkamancer Sculpts, em escala 1/8 e 305 mm de altura, em 34 peças.',
      'A peça inteira vive numa paleta escura: couro preto, tecido marrom queimado e prata suja. Tudo aqui é sombra, e o detalhe só sobrevive com realce seco nas quinas — sem isso, a silhueta vira um borrão preto na estante.',
      'O cabelo prateado e a echarpe clara no pescoço são os dois pontos de luz da composição, e é por eles que o olho entra na peça.',
    ],
    ficha: fichaOficial('204 × 132 × 305', '34 peças'),
    inclui: incluiComum,
  },
  {
    slug: 'toph',
    nome: 'Toph',
    serie: 'Avatar · A Lenda de Aang',
    origem: 'modelo',
    escultor: 'Alex Gray',
    estudio: 'Bulkamancer Sculpts',
    fotos: fotos('toph', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'A dobradora de terra em guarda, com as lascas de rocha subindo do chão.',
    paragrafos: [
      'Escultura de Alex Gray para o Bulkamancer Sculpts, em escala 1/8 e 261 mm de altura, em 16 peças.',
      'A pose é de impacto: pé firme, punho fechado e as lascas de rocha saindo do chão em leque atrás dela. Essa parte é pintada como pedra viva, com cinza frio na face de fora e ocre na fratura — senão vira um monte de espeto cinza.',
      'A máscara é opcional: dá para receber a peça com ou sem ela.',
    ],
    ficha: fichaOficial('113 × 193 × 261', '16 peças', 'Máscara opcional'),
    inclui: incluiComum,
  },
  {
    slug: 'verso',
    nome: 'Verso',
    serie: 'Clair Obscur · Expedition 33',
    origem: 'modelo',
    escultor: 'Vik3DFigures',
    fotos: fotos('verso', 7),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'Casaco escuro, faixa roxa e a espada baixa, no fim da caminhada.',
    paragrafos: [
      'É a peça mais contida do catálogo: nada de pose de combate, só a figura de pé com a espada baixa. Sem ação para chamar atenção, quem sustenta a peça é o tecido — e tecido escuro é o pior cenário possível para quem pinta.',
      'O casaco vai em camadas de cinza-azulado para as dobras existirem, com realce seco nas quinas. A faixa roxa da cintura e os cordões dourados do peito são os únicos pontos de cor, e por isso entram por último, com a peça já quase fechada.',
      'O cabelo grisalho e a barba pedem pincel fino: são fios curtos, um a um, com o branco puxado só nas pontas. A base é rocha baixa e discreta de propósito, para não competir com a figura.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
    inclui: incluiComum,
  },
  {
    slug: 'mario-e-luigi',
    nome: 'Mario & Luigi',
    serie: 'Super Mario',
    origem: 'modelo',
    fotos: fotos('mario_luigi', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'A dupla em poncho e sombrero, com as caveiras mexicanas pintadas no rosto.',
    paragrafos: [
      'Um par, não uma peça só: os dois irmãos lado a lado, de poncho bordado e sombrero, cada um na sua base — que podem ficar juntas ou separadas na estante.',
      'Depois do Qifrey, é a peça mais colorida que oferecemos. Os ponchos levam faixas em laranja, amarelo e verde pintadas uma a uma, e o bordado das barras sai ponto por ponto, na ponta do pincel.',
      'Nas artes do escultor a dupla aparece das duas formas, de rosto descoberto e com a caveira mexicana pintada; na hora da encomenda a gente combina qual das duas versões você quer na sua.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
    inclui: incluiComum,
  },
]

export const products = pecas.filter((p) => p.origem === 'lab')
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
export const fotoBancada = products[1].fotos[2]

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
  { brand: 'Creality', model: 'Halot Mage 8K', text: 'A impressora de resina onde a peça nasce. É ela que reproduz o corte do escultor.' },
  { brand: 'JAYO', model: 'Resina', text: 'A resina usada em tudo que sai daqui.' },
  { brand: 'Anycubic', model: 'Lavagem & Cura', text: 'Lava e cura a peça logo depois da impressão, antes de qualquer preparação de superfície.' },
  { brand: 'Pincel', model: 'Trabalho manual', text: 'Não existe pintura automatizada aqui. Cor, sombra, luz e detalhe entram à mão, um de cada vez.' },
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
    a: 'Uma peça física montada, pintada e envernizada, pronta para exposição e coleção — e não uma impressão 3D recém-tirada da máquina.',
  },
  {
    q: 'Como funcionam pagamento e envio?',
    a: 'Combinamos por mensagem, junto do orçamento. A produção fica em São Paulo.',
  },
]

export const whatsappUrl = 'https://wa.me/5531000000000'

/** Link de WhatsApp já com a peça escrita na mensagem. */
export function whatsappPeca(nome: string) {
  const texto = `Olá! Tenho interesse na peça ${nome}. Pode me passar o orçamento?`
  return `${whatsappUrl}?text=${encodeURIComponent(texto)}`
}
