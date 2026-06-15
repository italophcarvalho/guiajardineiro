/**
 * Guia Jardineiro — mock data
 *
 * Ported from the design prototype (`Guia Jardineiro.dc.html`). This is the
 * temporary content source for the scaffold and will be replaced by a headless
 * CMS later. Shapes match `lib/types.ts`.
 */

import type { Author, Category, Post, Product } from "./types";

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export const categories: Category[] = [
  {
    id: "interior",
    slug: "plantas-de-interior",
    label: "Plantas de Interior",
    tint: "#DCE8DD",
    count: 14,
    desc: "Espécies, cuidados, vasos e iluminação para cultivar dentro de casa.",
    subs: [
      { id: "suculentas", label: "Suculentas" },
      { id: "tropicais", label: "Folhagens" },
      { id: "luz", label: "Iluminação" },
    ],
  },
  {
    id: "horta",
    slug: "horta-em-casa",
    label: "Horta em Casa",
    tint: "#E8EDD5",
    count: 22,
    desc: "Cultive temperos, hortaliças e legumes mesmo nos menores espaços.",
    subs: [
      { id: "temperos", label: "Temperos" },
      { id: "hidroponia", label: "Hidroponia" },
      { id: "tomate", label: "Tomate" },
    ],
  },
  {
    id: "ferramentas",
    slug: "ferramentas",
    label: "Ferramentas",
    tint: "#E5E2D9",
    count: 18,
    desc: "Testes e comparativos das ferramentas que realmente valem o investimento.",
    subs: [
      { id: "poda", label: "Poda" },
      { id: "irrigacao", label: "Irrigação" },
    ],
  },
  {
    id: "paisagismo",
    slug: "paisagismo",
    label: "Paisagismo",
    tint: "#D6E4DC",
    count: 9,
    desc: "Ideias e projetos para jardins, canteiros e áreas externas.",
    subs: [],
  },
  {
    id: "pragas",
    slug: "pragas-e-doencas",
    label: "Pragas e Doenças",
    tint: "#EADFD2",
    count: 11,
    desc: "Diagnóstico e combate natural às pragas e doenças mais comuns.",
    subs: [],
  },
];

/* ------------------------------------------------------------------ */
/* Authors                                                             */
/* ------------------------------------------------------------------ */

export const authors: Author[] = [
  {
    id: "marina",
    slug: "marina-couto",
    name: "Marina Couto",
    firstName: "Marina",
    initial: "M",
    role: "Editora de Plantas de Interior",
    bio: "Bióloga e jardineira urbana há 12 anos. Especialista em plantas de interior, suculentas e iluminação artificial para cultivo. Já matou samambaias suficientes para aprender, na prática, o que realmente funciona dentro de casa.",
    specialties: ["Plantas de Interior", "Suculentas", "Iluminação"],
  },
  {
    id: "rafael",
    slug: "rafael-tavares",
    name: "Rafael Tavares",
    firstName: "Rafael",
    initial: "R",
    role: "Engenheiro Agrônomo",
    bio: "Engenheiro agrônomo formado pela ESALQ, com foco em horticultura doméstica e ferramentas de jardim. Testa cada produto em condições reais — chuva, sol e raiz — antes de recomendar qualquer coisa.",
    specialties: ["Ferramentas", "Horta em Casa", "Adubação"],
  },
];

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export const products: Product[] = [
  {
    id: "p1",
    name: 'Tesoura de Poda Bypass Pro 8"',
    brand: "CorteFino",
    rating: "4,8",
    reviews: 2143,
    price: 89,
    tint: "#E5E2D9",
    tag: "Melhor geral",
  },
  {
    id: "p2",
    name: "Kit Irrigação Gotejamento 25m",
    brand: "AquaVerde",
    rating: "4,6",
    price: 149,
    tint: "#D6E4DC",
    tag: "Custo-benefício",
  },
  {
    id: "p6",
    name: "Adubo Orgânico Húmus 5kg",
    brand: "NutriSolo",
    rating: "4,9",
    price: 28,
    tint: "#E8EDD5",
  },
  {
    id: "substrato-suculentas-cactos",
    name: "Substrato para Suculentas e Cactos 5kg",
    brand: "VerdeVaso",
    rating: "4,7",
    reviews: 980,
    price: 39,
    tint: "#DCE8DD",
    tag: "Melhor geral",
  },
  {
    id: "vaso-drenagem-suculentas-pp",
    name: "Vaso com Furo de Drenagem 12cm (kit 3)",
    brand: "PlantePP",
    rating: "4,5",
    reviews: 412,
    price: 34,
    tint: "#DCE8DD",
    tag: "Complementar",
  },
];

/* ------------------------------------------------------------------ */
/* Posts                                                               */
/* ------------------------------------------------------------------ */

export const posts: Post[] = [
  {
    id: "tesouras",
    slug: "melhores-tesouras-de-poda-2026",
    title: "As 7 melhores tesouras de poda de 2026",
    shortTitle: "Tesouras de poda",
    excerpt:
      "Testamos 19 modelos por 3 meses para encontrar as tesouras que cortam limpo e duram anos.",
    type: "Comparativo",
    categoryId: "ferramentas",
    categoryLabel: "Ferramentas",
    subtopicId: "poda",
    authorId: "rafael",
    authorName: "Rafael Tavares",
    date: "8 jun 2026",
    publishedAt: "2026-06-08",
    read: "12 min",
    status: "publicado",
    tint: "#E5E2D9",
    metaDesc:
      "Testamos 19 tesouras de poda por 3 meses. Veja as 7 melhores de 2026, com prós, contras e a melhor escolha para cada perfil.",
    tags: ["tesoura de poda", "ferramentas", "poda"],
    citedProductIds: ["p1", "p2", "p6"],
    views: 18420,
    affiliateCtr: "4,2%",
  },
  {
    id: "horta-varanda",
    slug: "horta-de-temperos-na-varanda",
    title: "Como montar uma horta de temperos na varanda",
    shortTitle: "Horta de temperos",
    excerpt:
      "Manjericão, alecrim e cebolinha em qualquer espaço — passo a passo do vaso à colheita.",
    type: "Guia",
    categoryId: "horta",
    categoryLabel: "Horta em Casa",
    subtopicId: "temperos",
    authorId: "marina",
    authorName: "Marina Couto",
    date: "6 jun 2026",
    publishedAt: "2026-06-06",
    read: "9 min",
    status: "publicado",
    tint: "#E8EDD5",
    metaDesc:
      "Passo a passo para montar uma horta de temperos na varanda: vasos, substrato, luz e colheita de manjericão, alecrim e cebolinha.",
    tags: ["horta", "temperos", "varanda"],
    citedProductIds: ["p6"],
    views: 12030,
    affiliateCtr: "2,8%",
  },
  {
    id: "suculentas",
    slug: "suculentas-para-iniciantes",
    title: "Suculentas para iniciantes: 12 espécies que não morrem",
    shortTitle: "Suculentas para iniciantes",
    excerpt:
      "As variedades mais resistentes para quem está começando — e os 3 erros que mais matam suculentas.",
    type: "Guia",
    categoryId: "interior",
    categoryLabel: "Plantas de Interior",
    subtopicId: "suculentas",
    authorId: "marina",
    authorName: "Marina Couto",
    date: "4 jun 2026",
    publishedAt: "2026-06-04",
    read: "7 min",
    status: "publicado",
    tint: "#DCE8DD",
    metaDesc:
      "12 suculentas resistentes para iniciantes e os 3 erros que mais matam essas plantas. Guia prático para começar sem frustração.",
    tags: ["suculentas", "plantas de interior", "iniciantes"],
    citedProductIds: [],
    views: 22890,
    affiliateCtr: "1,9%",
  },
  {
    id: "irrigacao",
    slug: "melhores-kits-de-irrigacao-gotejamento",
    title: "Os 5 melhores kits de irrigação por gotejamento",
    shortTitle: "Kits de irrigação",
    excerpt:
      "Economize água e nunca mais esqueça de regar. Comparamos custo, cobertura e instalação.",
    type: "Comparativo",
    categoryId: "ferramentas",
    categoryLabel: "Ferramentas",
    subtopicId: "irrigacao",
    authorId: "rafael",
    authorName: "Rafael Tavares",
    date: "2 jun 2026",
    publishedAt: "2026-06-02",
    read: "10 min",
    status: "publicado",
    tint: "#E5E2D9",
    metaDesc:
      "Comparamos 5 kits de irrigação por gotejamento por custo, cobertura e instalação. Veja qual economiza mais água sem complicação.",
    tags: ["irrigação", "gotejamento", "ferramentas"],
    citedProductIds: ["p2"],
    views: 9870,
    affiliateCtr: "5,1%",
  },
  {
    id: "adubacao",
    slug: "guia-de-adubacao-organica",
    title: "Guia completo de adubação orgânica",
    shortTitle: "Adubação orgânica",
    excerpt:
      "NPK, húmus, bokashi e compostagem caseira explicados sem complicação.",
    type: "Guia",
    categoryId: "horta",
    categoryLabel: "Horta em Casa",
    subtopicId: "tomate",
    authorId: "rafael",
    authorName: "Rafael Tavares",
    date: "30 mai 2026",
    publishedAt: "2026-05-30",
    read: "14 min",
    status: "publicado",
    tint: "#E8EDD5",
    metaDesc:
      "NPK, húmus, bokashi e compostagem caseira explicados de forma simples. O guia completo de adubação orgânica para a sua horta.",
    tags: ["adubação", "orgânico", "compostagem"],
    citedProductIds: ["p6"],
    views: 15640,
    affiliateCtr: "3,4%",
  },
  {
    id: "luz",
    slug: "melhores-luzes-de-cultivo",
    title: "Iluminação para plantas: as melhores luzes de cultivo",
    shortTitle: "Luzes de cultivo",
    excerpt:
      "Full spectrum, PAR e consumo — descubra qual grow light combina com as suas plantas.",
    type: "Comparativo",
    categoryId: "interior",
    categoryLabel: "Plantas de Interior",
    subtopicId: "luz",
    authorId: "marina",
    authorName: "Marina Couto",
    date: "28 mai 2026",
    publishedAt: "2026-05-28",
    read: "11 min",
    status: "publicado",
    tint: "#DCE8DD",
    metaDesc:
      "Full spectrum, PAR e consumo: comparamos as melhores luzes de cultivo (grow lights) para plantas de interior em 2026.",
    tags: ["iluminação", "grow light", "plantas de interior"],
    citedProductIds: [],
    views: 8120,
    affiliateCtr: "4,7%",
  },
  {
    id: "pragas-naturais",
    slug: "combate-natural-a-pragas",
    title: "Combate natural a pragas: 8 receitas caseiras",
    shortTitle: "Combate natural a pragas",
    excerpt:
      "Calda de fumo, óleo de neem e sabão — o que realmente funciona contra cochonilha e pulgão.",
    type: "Guia",
    categoryId: "pragas",
    categoryLabel: "Pragas e Doenças",
    authorId: "marina",
    authorName: "Marina Couto",
    date: "25 mai 2026",
    publishedAt: "2026-05-25",
    read: "8 min",
    status: "publicado",
    tint: "#EADFD2",
    metaDesc:
      "8 receitas caseiras contra pragas: calda de fumo, óleo de neem e sabão. O que funciona de verdade contra cochonilha e pulgão.",
    tags: ["pragas", "neem", "controle natural"],
    citedProductIds: [],
    views: 11250,
    affiliateCtr: "1,2%",
  },
  {
    id: "vasos",
    slug: "melhores-vasos-autoirrigaveis",
    title: "Os melhores vasos autoirrigáveis testados",
    shortTitle: "Vasos autoirrigáveis",
    excerpt:
      "Reservatório, drenagem e design: 6 vasos que facilitam a vida de quem viaja.",
    type: "Comparativo",
    categoryId: "interior",
    categoryLabel: "Plantas de Interior",
    subtopicId: "tropicais",
    authorId: "marina",
    authorName: "Marina Couto",
    date: "22 mai 2026",
    publishedAt: "2026-05-22",
    read: "6 min",
    status: "publicado",
    tint: "#DCE8DD",
    metaDesc:
      "Testamos 6 vasos autoirrigáveis por reservatório, drenagem e design. Os melhores para quem viaja e esquece de regar.",
    tags: ["vasos", "autoirrigável", "plantas de interior"],
    citedProductIds: [],
    views: 7430,
    affiliateCtr: "3,9%",
  },
  {
    id: "hidroponia",
    slug: "hidroponia-caseira-barata",
    title: "Hidroponia caseira: comece com menos de R$ 200",
    shortTitle: "Hidroponia caseira",
    excerpt:
      "Sistema NFT simples para alface e folhosas dentro de um apartamento.",
    type: "Guia",
    categoryId: "horta",
    categoryLabel: "Horta em Casa",
    subtopicId: "hidroponia",
    authorId: "rafael",
    authorName: "Rafael Tavares",
    date: "19 mai 2026",
    publishedAt: "2026-05-19",
    read: "13 min",
    status: "publicado",
    tint: "#E8EDD5",
    metaDesc:
      "Monte um sistema de hidroponia caseira (NFT) para alface e folhosas com menos de R$ 200, mesmo em apartamento.",
    tags: ["hidroponia", "NFT", "horta"],
    citedProductIds: [],
    views: 6980,
    affiliateCtr: "2,1%",
  },
];

/* ------------------------------------------------------------------ */
/* Ranking (Comparativo / Ranking screen)                              */
/* ------------------------------------------------------------------ */

export interface RankingEntry {
  rank: number;
  anchor: string;
  name: string;
  badge: string;
  rating: string;
  reviews: string;
  price: string;
  bestFor: string;
  pros: string[];
  cons: string[];
}

export const tesourasRanking: RankingEntry[] = [
  {
    rank: 1,
    anchor: "rank-1",
    name: 'CorteFino Bypass Pro 8"',
    badge: "Melhor geral",
    rating: "4,8",
    reviews: "2.143",
    price: "89",
    bestFor: "uso geral em roseiras e arbustos",
    pros: [
      "Corte limpo até 25 mm",
      "Cabo ergonômico antiderrapante",
      "Peças de reposição fáceis de achar",
    ],
    cons: ["Mola um pouco rígida no início"],
  },
  {
    rank: 2,
    anchor: "rank-2",
    name: 'GardenLight Bypass 6"',
    badge: "Mais leve",
    rating: "4,5",
    reviews: "870",
    price: "52",
    bestFor: "mãos pequenas e podas delicadas",
    pros: ["Leve e compacta", "Excelente custo-benefício", "Trava de uma mão"],
    cons: ["Não corta galhos grossos"],
  },
  {
    rank: 3,
    anchor: "rank-3",
    name: 'IronCut Anvil 9"',
    badge: "Galhos grossos",
    rating: "4,4",
    reviews: "1.210",
    price: "118",
    bestFor: "galhos lenhosos de até 32 mm",
    pros: ["Muito potente", "Durabilidade alta", "Lâmina substituível"],
    cons: ["Pesada para uso longo", "Esmaga hastes verdes"],
  },
  {
    rank: 4,
    anchor: "rank-4",
    name: "EcoSnip Pro",
    badge: "Sustentável",
    rating: "4,3",
    reviews: "540",
    price: "69",
    bestFor: "quem prioriza material reciclado",
    pros: ["Cabos de plástico reciclado", "Corte preciso", "Boa garantia"],
    cons: ["Lâmina exige afiação frequente"],
  },
  {
    rank: 5,
    anchor: "rank-5",
    name: "BudgetTrim Basic",
    badge: "Mais barata",
    rating: "4,1",
    reviews: "3.020",
    price: "29",
    bestFor: "iniciantes e uso esporádico",
    pros: ["Preço imbatível", "Leve", "Ótima para começar"],
    cons: ["Durabilidade limitada", "Trava simples"],
  },
];

/* ------------------------------------------------------------------ */
/* Legal documents                                                     */
/* ------------------------------------------------------------------ */

export type LegalDocKey = "privacy" | "terms" | "cookies" | "affiliate";

export interface LegalSection {
  h: string;
  p: string;
}

export interface LegalDoc {
  key: LegalDocKey;
  title: string;
  updated: string;
  sections: LegalSection[];
}

export const legalDocs: Record<LegalDocKey, LegalDoc> = {
  privacy: {
    key: "privacy",
    title: "Política de Privacidade",
    updated: "1 jun 2026",
    sections: [
      {
        h: "Quais dados coletamos",
        p: "Coletamos apenas o necessário: o e-mail que você fornece ao assinar a newsletter ou enviar mensagens pelo formulário de contato, além de dados de navegação anônimos (páginas visitadas, dispositivo e origem do acesso) para entender o que é útil para você.",
      },
      {
        h: "Como usamos seus dados",
        p: "Usamos seu e-mail exclusivamente para enviar conteúdos que você pediu e responder suas mensagens. Dados de navegação são agregados e usados apenas para melhorar o site. Nunca vendemos seus dados a terceiros.",
      },
      {
        h: "Seus direitos (LGPD)",
        p: "Conforme a Lei Geral de Proteção de Dados, você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento, além de cancelar a inscrição na newsletter com um clique. Basta escrever para privacidade@guiajardineiro.com.br.",
      },
      {
        h: "Cookies e terceiros",
        p: "Utilizamos cookies para funcionamento e medição de audiência. Parceiros de afiliados podem registrar cliques para atribuir comissões. Veja detalhes na nossa Política de Cookies.",
      },
    ],
  },
  terms: {
    key: "terms",
    title: "Termos de Uso",
    updated: "1 jun 2026",
    sections: [
      {
        h: "Aceitação dos termos",
        p: "Ao acessar o Guia Jardineiro, você concorda com estes Termos de Uso. Se não concordar com algum ponto, pedimos que não utilize o site.",
      },
      {
        h: "Natureza do conteúdo",
        p: "Nosso conteúdo tem caráter informativo e reflete a opinião editorial baseada em testes e pesquisa. Não substitui orientação técnica profissional para casos específicos de cultivo, pragas ou uso de produtos químicos.",
      },
      {
        h: "Propriedade intelectual",
        p: "Textos, fotos e materiais originais publicados aqui são protegidos por direitos autorais. A reprodução é permitida apenas com crédito e link para a página original.",
      },
      {
        h: "Limitação de responsabilidade",
        p: "Fazemos o possível para manter as informações corretas e atualizadas, mas não nos responsabilizamos por decisões de compra ou cultivo tomadas com base no conteúdo. Preços e disponibilidade nas lojas parceiras podem mudar sem aviso.",
      },
    ],
  },
  cookies: {
    key: "cookies",
    title: "Política de Cookies",
    updated: "1 jun 2026",
    sections: [
      {
        h: "O que são cookies",
        p: "Cookies são pequenos arquivos que o site guarda no seu navegador para lembrar preferências e medir o uso das páginas.",
      },
      {
        h: "Cookies que usamos",
        p: "Usamos cookies essenciais (para o site funcionar), de análise (audiência anônima) e de afiliados, que registram quando você clica em um link de produto para que a comissão seja corretamente atribuída.",
      },
      {
        h: "Como gerenciar",
        p: "Você pode bloquear ou apagar cookies nas configurações do seu navegador a qualquer momento. Lembre-se de que desativar alguns cookies pode afetar funcionalidades do site.",
      },
    ],
  },
  affiliate: {
    key: "affiliate",
    title: "Divulgação de Links de Afiliados",
    updated: "1 jun 2026",
    sections: [
      {
        h: "Divulgação (modelo FTC / LGPD)",
        p: "Em conformidade com as diretrizes da FTC e a legislação brasileira, informamos de forma clara: o Guia Jardineiro contém links de afiliados. Quando você compra através deles, podemos receber uma comissão, sem qualquer custo adicional para você.",
      },
      {
        h: "Programa de Associados da Amazon",
        p: "Participamos do Programa de Associados da Amazon, um programa de publicidade que nos permite ganhar comissões por meio de links para o site da Amazon e produtos qualificados.",
      },
      {
        h: "Nossa independência",
        p: "As comissões ajudam a manter o site e a financiar novos testes, mas nunca influenciam nossa opinião. As recomendações e posições nos rankings são definidas exclusivamente pela nossa avaliação editorial independente.",
      },
      {
        h: "Identificação dos links",
        p: "Sempre que possível, sinalizamos os links e botões de compra como recomendações comerciais. Em caso de dúvida, escreva para contato@guiajardineiro.com.br.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Lookup helpers                                                      */
/* ------------------------------------------------------------------ */

export const getPostBySlug = (slug: string) =>
  posts.find((p) => p.slug === slug);
export const getCategoryById = (id: string) =>
  categories.find((c) => c.id === id);
export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
export const getAuthorById = (id: string) => authors.find((a) => a.id === id);
export const getAuthorBySlug = (slug: string) =>
  authors.find((a) => a.slug === slug);
export const getProductById = (id: string) =>
  products.find((p) => p.id === id);
export const getPostsByCategory = (categoryId: string) =>
  posts.filter((p) => p.categoryId === categoryId);
export const getPostsByAuthor = (authorId: string) =>
  posts.filter((p) => p.authorId === authorId);
