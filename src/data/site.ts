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
  'Fotos da peça pronta antes do envio',
  'Envio com código de rastreio para todo o Brasil',
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
    fotos: fotos('sukuna', 7),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'O Rei das Maldições sobre o crânio, com o fogo subindo da base.',
    paragrafos: [
      'Escultura com muita pele exposta, o que torna a peça um exercício de degradê: o tom precisa variar do músculo à sombra sem marcar transição. As marcas pretas do rosto e do tronco entram depois, à mão livre, e é onde a peça ganha ou perde a semelhança.',
      'As quatro marcas do rosto, os dois pares de olhos e as bocas extras do tronco entram à mão livre, depois da pele pronta. Errar a espessura dessas linhas é errar o Sukuna: é o traço que faz o Rei das Maldições parecer ele mesmo.',
      'A base traz crânios, a arcada e as chamas esculpidas, que pintamos em laranja quente com as pontas puxadas ao branco para simular incandescência.',
    ],
    ficha: [
      { rotulo: 'Altura', valor: '330 mm' },
      { rotulo: 'Base', valor: '211 × 229 mm' },
      ...fichaComum,
    ],
    inclui: incluiComum,
  },
  {
    slug: 'roy-mustang',
    nome: 'Roy Mustang',
    serie: 'Fullmetal Alchemist',
    origem: 'modelo',
    escultor: 'KAI',
    fotos: fotos('roy_mustang', 7),
    badges: ['Sob encomenda'],
    chamada: 'O Alquimista de Chamas com o estalo aceso na ponta dos dedos.',
    paragrafos: [
      'O uniforme azul-escuro é o desafio: azul escuro engole detalhe se for pintado chapado, então vai em camadas, com realce nas dobras e nos vivos dourados do casaco.',
      'A luva de ignição da mão direita é o detalhe que define o personagem: o círculo de transmutação bordado nela sai pintado à mão, fio a fio, e a chama que nasce do estalo é feita em degradê do branco ao laranja para parecer temperatura, não tinta.',
      'O fogo da base sobe pelo casaco esvoaçante e ilumina o tecido de baixo para cima — é essa luz pintada que amarra a peça e faz o Alquimista de Chamas parecer no meio de um combate, e não posando.',
    ],
    ficha: [
      { rotulo: 'Altura', valor: '233 mm' },
      { rotulo: 'Base', valor: '164 × 209 mm' },
      ...fichaComum,
    ],
    inclui: incluiComum,
  },
  {
    slug: 'roy-mustang-ferido',
    nome: 'Roy Mustang · Ferido',
    serie: 'Fullmetal Alchemist',
    origem: 'modelo',
    escultor: 'KAI',
    fotos: fotos('mustang_dodoi', 7),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'A versão marcada pela batalha, para quem prefere a cena dramática.',
    paragrafos: [
      'Variante da escultura anterior, com o dano da batalha esculpido. Pede uma pintura mais suja: o uniforme perde o brilho, ganha poeira nas partes baixas e o tecido rasgado recebe fiapos pintados um a um.',
      'O uniforme rasgado deixa o torso à mostra, e é aí que a peça se decide: o hematoma e o sangue seco pedem camadas transparentes por cima da pele já pronta, senão viram uma mancha vermelha chapada.',
      'Funciona especialmente bem ao lado da versão íntegra, formando um par que conta a passagem da luta na estante.',
    ],
    ficha: [
      { rotulo: 'Altura', valor: '237 mm' },
      { rotulo: 'Base', valor: '132 × 161 mm' },
      ...fichaComum,
    ],
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
      'O chapéu pontudo e o manto em movimento dão bastante superfície para trabalhar sombra, e o caldeirão suspenso no aro da base — com a água e as folhas dentro — é uma segunda cena inteira, pintada separada antes de a peça fechar.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
    inclui: incluiComum,
  },
  {
    slug: 'frieren',
    nome: 'Frieren',
    serie: 'Frieren e a Jornada para o Além',
    origem: 'modelo',
    escultor: 'YoruNoAne',
    fotos: fotos('frieren', 7),
    badges: ['Sob encomenda'],
    chamada: 'A maga elfa com coroa de flores, cajado em arco e o manto aberto no vento.',
    paragrafos: [
      'É a peça de paleta mais clara que oferecemos, e por isso a mais implacável: branco e prata não escondem nada, então cada risco de lixa precisa sumir antes da primeira camada de tinta. O manto e a saia são superfície lisa quase inteira — só o acabamento sustenta.',
      'O cabelo prateado sai em duas marias longas que atravessam a composição. Vai com base fria e realce quase branco nas mechas de cima, para o volume aparecer mesmo de longe, e a coroa de flores entra depois, flor por flor, como o único ponto de cor quente da peça.',
      'O cajado desenha um arco por trás do corpo, e os anéis ficam em resina translúcida, sem pigmento opaco, para acender com a luz do ambiente — o mesmo tratamento que damos à chakra do Madara e às notas do Link criança.',
    ],
    ficha: [
      { rotulo: 'Altura', valor: '276 mm' },
      { rotulo: 'Base', valor: '167 × 145 mm' },
      ...fichaComum,
    ],
    inclui: incluiComum,
  },
  {
    slug: 'claire-redfield',
    nome: 'Claire Redfield',
    serie: 'Resident Evil',
    origem: 'modelo',
    escultor: 'Szymon Szpaczek',
    fotos: fotos('claire_redfield', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'Jaqueta de couro vermelha, pistola em punho e o "Let me live" nas costas.',
    paragrafos: [
      'A jaqueta é o centro da peça: vermelho de couro montado em camadas, com verniz seletivo só nas partes altas. É o que separa couro de plástico pintado de vermelho quando a luz da estante bate na peça.',
      'Nas costas vem o "Let me live" com o anjo alado em relevo, pintado à mão livre — o detalhe que quem jogou Resident Evil 2 procura assim que vira a peça.',
      'A base é o piso de pedra da delegacia, com brasões em relevo, coluna quebrada e entulho. Cada material leva uma lavagem de sujeira diferente, senão o conjunto vira um bloco cinza só.',
    ],
    ficha: [
      { rotulo: 'Altura', valor: '237 mm' },
      { rotulo: 'Base', valor: '119 × 120 mm' },
      ...fichaComum,
    ],
    inclui: incluiComum,
  },
  {
    slug: 'gwen-stacy',
    nome: 'Gwen Stacy',
    serie: 'Marvel · Aranhaverso',
    origem: 'modelo',
    escultor: 'Lukas Lima e Alex Gray',
    fotos: fotos('gwen_stacy', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'Equilibrada no poste da Broadway, capuz aberto e o V nos dedos.',
    paragrafos: [
      'O traje é branco, preto e um rosa que precisa cair exatamente no tom: o rosa da Gwen é marca registrada e denuncia qualquer erro de mistura. As faixas correm do capuz até o pé, e cada uma é mascarada e pintada separada da vizinha.',
      'A pose se apoia em uma perna só, sobre o poste com semáforo e as placas de Broadway e Wall St. As placas levam letra pintada à mão e desgaste de metal exposto; os pombos da base saem em cinza fumê com o peito iridescente.',
      'O capuz aberto deixa o cabelo loiro e o rosto à mostra, e é aí que a peça se decide — olho pequeno, sobrancelha marcada e nenhum espaço para pincel tremido.',
    ],
    ficha: [
      { rotulo: 'Altura', valor: '234 mm' },
      { rotulo: 'Base', valor: '104 × 164 mm' },
      ...fichaComum,
    ],
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
    fotos: fotos('lady_maria', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'Chapéu tricórnio, lâmina em punho e a sala da torre do relógio sob os pés.',
    paragrafos: [
      'A peça inteira vive numa paleta escura: couro preto, tecido marrom queimado e prata suja. Tudo aqui é sombra, e o detalhe só sobrevive com realce seco nas quinas — sem isso, a silhueta vira um borrão preto na estante.',
      'O cabelo prateado e a echarpe clara no pescoço são os dois pontos de luz da composição, e é por eles que o olho entra na peça. O sangue da lâmina entra por último, em camadas transparentes, para ficar úmido em vez de virar tinta vermelha.',
      'A base é a sala hexagonal da torre, com arcos vazados. É onde a escultura ganha profundidade e onde a pintura precisa fingir uma fonte de luz que não existe.',
    ],
    ficha: [
      { rotulo: 'Altura', valor: '305 mm' },
      { rotulo: 'Base', valor: '132 × 204 mm' },
      ...fichaComum,
    ],
    inclui: incluiComum,
  },
  {
    slug: 'toph',
    nome: 'Toph',
    serie: 'Avatar · A Lenda de Aang',
    origem: 'modelo',
    escultor: 'Alex Gray',
    fotos: fotos('toph', 8),
    badges: ['Novidade', 'Sob encomenda'],
    chamada: 'A dobradora de terra adulta, punhos fechados e as lascas de rocha subindo do chão.',
    paragrafos: [
      'A pose é de impacto: pé firme, punho fechado e as lascas de rocha saindo do chão em leque atrás dela. Essa parte é pintada como pedra viva, com cinza frio na face de fora e ocre na fratura — senão vira um monte de espeto cinza.',
      'O corpo é o outro desafio. É uma escultura de musculatura marcada e muita pele exposta, o que significa degradê sem transição visível: sombra na costela, luz no ombro e nada de linha dura entre as duas.',
      'A faixa do peito e a calça verde seguram a paleta, e a bandana amarela na testa é o único ponto de cor forte — o truque de sempre para o olho ir direto ao rosto.',
    ],
    ficha: [...alturaEscala, ...fichaComum],
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
  { title: 'Resina Premium', text: 'Resina de alta densidade, curada por UV, com acabamento firme e sem deformar com o tempo.' },
  { title: 'Pintura à Mão', text: 'Aerografia e pincel, camada por camada. Nenhuma peça sai igual à outra.' },
  { title: 'Envio Rastreado', text: 'Fotos da peça pronta antes de despachar e código de rastreio até a sua porta, em todo o Brasil.' },
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
    a: 'Sinal para entrar na fila do Lab e o restante antes do envio. Parcelamos no cartão; combinamos tudo por mensagem, sem letra miúda.',
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
