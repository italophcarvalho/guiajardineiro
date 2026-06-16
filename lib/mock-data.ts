/**
 * Guia Jardineiro â€” mock data
 *
 * Ported from the design prototype (`Guia Jardineiro.dc.html`). This is the
 * temporary content source for the scaffold and will be replaced by a headless
 * CMS later. Shapes match `lib/types.ts`.
 */

import type { Author, Category, Product } from "./types";

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
    desc: "EspÃ©cies, cuidados, vasos e iluminaÃ§Ã£o para cultivar dentro de casa.",
    subs: [
      { id: "suculentas", label: "Suculentas" },
      { id: "tropicais", label: "Folhagens" },
      { id: "luz", label: "IluminaÃ§Ã£o" },
    ],
  },
  {
    id: "horta",
    slug: "horta-em-casa",
    label: "Horta em Casa",
    tint: "#E8EDD5",
    count: 22,
    desc: "Cultive temperos, hortaliÃ§as e legumes mesmo nos menores espaÃ§os.",
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
      { id: "irrigacao", label: "IrrigaÃ§Ã£o" },
    ],
  },
  {
    id: "paisagismo",
    slug: "paisagismo",
    label: "Paisagismo",
    tint: "#D6E4DC",
    count: 9,
    desc: "Ideias e projetos para jardins, canteiros e Ã¡reas externas.",
    subs: [],
  },
  {
    id: "pragas",
    slug: "pragas-e-doencas",
    label: "Pragas e DoenÃ§as",
    tint: "#EADFD2",
    count: 11,
    desc: "DiagnÃ³stico e combate natural Ã s pragas e doenÃ§as mais comuns.",
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
    bio: "BiÃ³loga e jardineira urbana hÃ¡ 12 anos. Especialista em plantas de interior, suculentas e iluminaÃ§Ã£o artificial para cultivo. JÃ¡ matou samambaias suficientes para aprender, na prÃ¡tica, o que realmente funciona dentro de casa.",
    specialties: ["Plantas de Interior", "Suculentas", "IluminaÃ§Ã£o"],
  },
  {
    id: "rafael",
    slug: "rafael-tavares",
    name: "Rafael Tavares",
    firstName: "Rafael",
    initial: "R",
    role: "Engenheiro AgrÃ´nomo",
    bio: "Engenheiro agrÃ´nomo formado pela ESALQ, com foco em horticultura domÃ©stica e ferramentas de jardim. Testa cada produto em condiÃ§Ãµes reais â€” chuva, sol e raiz â€” antes de recomendar qualquer coisa.",
    specialties: ["Ferramentas", "Horta em Casa", "AdubaÃ§Ã£o"],
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
    name: "Kit IrrigaÃ§Ã£o Gotejamento 25m",
    brand: "AquaVerde",
    rating: "4,6",
    price: 149,
    tint: "#D6E4DC",
    tag: "Custo-benefÃ­cio",
  },
  {
    id: "p6",
    name: "Adubo OrgÃ¢nico HÃºmus 5kg",
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
  {
    id: "vaso-autoirrigavel-herbs-pp",
    name: "Vaso AutoirrigÃ¡vel para Temperos (kit 2)",
    brand: "PlantePP",
    rating: "4,6",
    reviews: 530,
    price: 59,
    tint: "#E8EDD5",
    tag: "Melhor geral",
  },
  {
    id: "kit-mudas-temperos-essenciais",
    name: "Kit de Mudas de Temperos Essenciais",
    brand: "HortaViva",
    rating: "4,4",
    reviews: 210,
    price: 49,
    tint: "#E8EDD5",
    tag: "Complementar",
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
      "Corte limpo atÃ© 25 mm",
      "Cabo ergonÃ´mico antiderrapante",
      "PeÃ§as de reposiÃ§Ã£o fÃ¡ceis de achar",
    ],
    cons: ["Mola um pouco rÃ­gida no inÃ­cio"],
  },
  {
    rank: 2,
    anchor: "rank-2",
    name: 'GardenLight Bypass 6"',
    badge: "Mais leve",
    rating: "4,5",
    reviews: "870",
    price: "52",
    bestFor: "mÃ£os pequenas e podas delicadas",
    pros: ["Leve e compacta", "Excelente custo-benefÃ­cio", "Trava de uma mÃ£o"],
    cons: ["NÃ£o corta galhos grossos"],
  },
  {
    rank: 3,
    anchor: "rank-3",
    name: 'IronCut Anvil 9"',
    badge: "Galhos grossos",
    rating: "4,4",
    reviews: "1.210",
    price: "118",
    bestFor: "galhos lenhosos de atÃ© 32 mm",
    pros: ["Muito potente", "Durabilidade alta", "LÃ¢mina substituÃ­vel"],
    cons: ["Pesada para uso longo", "Esmaga hastes verdes"],
  },
  {
    rank: 4,
    anchor: "rank-4",
    name: "EcoSnip Pro",
    badge: "SustentÃ¡vel",
    rating: "4,3",
    reviews: "540",
    price: "69",
    bestFor: "quem prioriza material reciclado",
    pros: ["Cabos de plÃ¡stico reciclado", "Corte preciso", "Boa garantia"],
    cons: ["LÃ¢mina exige afiaÃ§Ã£o frequente"],
  },
  {
    rank: 5,
    anchor: "rank-5",
    name: "BudgetTrim Basic",
    badge: "Mais barata",
    rating: "4,1",
    reviews: "3.020",
    price: "29",
    bestFor: "iniciantes e uso esporÃ¡dico",
    pros: ["PreÃ§o imbatÃ­vel", "Leve", "Ã“tima para comeÃ§ar"],
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
    title: "PolÃ­tica de Privacidade",
    updated: "1 jun 2026",
    sections: [
      {
        h: "Quais dados coletamos",
        p: "Coletamos apenas o necessÃ¡rio: o e-mail que vocÃª fornece ao assinar a newsletter ou enviar mensagens pelo formulÃ¡rio de contato, alÃ©m de dados de navegaÃ§Ã£o anÃ´nimos (pÃ¡ginas visitadas, dispositivo e origem do acesso) para entender o que Ã© Ãºtil para vocÃª.",
      },
      {
        h: "Como usamos seus dados",
        p: "Usamos seu e-mail exclusivamente para enviar conteÃºdos que vocÃª pediu e responder suas mensagens. Dados de navegaÃ§Ã£o sÃ£o agregados e usados apenas para melhorar o site. Nunca vendemos seus dados a terceiros.",
      },
      {
        h: "Seus direitos (LGPD)",
        p: "Conforme a Lei Geral de ProteÃ§Ã£o de Dados, vocÃª pode solicitar acesso, correÃ§Ã£o ou exclusÃ£o dos seus dados a qualquer momento, alÃ©m de cancelar a inscriÃ§Ã£o na newsletter com um clique. Basta escrever para privacidade@guiajardineiro.com.br.",
      },
      {
        h: "Cookies e terceiros",
        p: "Utilizamos cookies para funcionamento e mediÃ§Ã£o de audiÃªncia. Parceiros de afiliados podem registrar cliques para atribuir comissÃµes. Veja detalhes na nossa PolÃ­tica de Cookies.",
      },
    ],
  },
  terms: {
    key: "terms",
    title: "Termos de Uso",
    updated: "1 jun 2026",
    sections: [
      {
        h: "AceitaÃ§Ã£o dos termos",
        p: "Ao acessar o Guia Jardineiro, vocÃª concorda com estes Termos de Uso. Se nÃ£o concordar com algum ponto, pedimos que nÃ£o utilize o site.",
      },
      {
        h: "Natureza do conteÃºdo",
        p: "Nosso conteÃºdo tem carÃ¡ter informativo e reflete a opiniÃ£o editorial baseada em testes e pesquisa. NÃ£o substitui orientaÃ§Ã£o tÃ©cnica profissional para casos especÃ­ficos de cultivo, pragas ou uso de produtos quÃ­micos.",
      },
      {
        h: "Propriedade intelectual",
        p: "Textos, fotos e materiais originais publicados aqui sÃ£o protegidos por direitos autorais. A reproduÃ§Ã£o Ã© permitida apenas com crÃ©dito e link para a pÃ¡gina original.",
      },
      {
        h: "LimitaÃ§Ã£o de responsabilidade",
        p: "Fazemos o possÃ­vel para manter as informaÃ§Ãµes corretas e atualizadas, mas nÃ£o nos responsabilizamos por decisÃµes de compra ou cultivo tomadas com base no conteÃºdo. PreÃ§os e disponibilidade nas lojas parceiras podem mudar sem aviso.",
      },
    ],
  },
  cookies: {
    key: "cookies",
    title: "PolÃ­tica de Cookies",
    updated: "1 jun 2026",
    sections: [
      {
        h: "O que sÃ£o cookies",
        p: "Cookies sÃ£o pequenos arquivos que o site guarda no seu navegador para lembrar preferÃªncias e medir o uso das pÃ¡ginas.",
      },
      {
        h: "Cookies que usamos",
        p: "Usamos cookies essenciais (para o site funcionar), de anÃ¡lise (audiÃªncia anÃ´nima) e de afiliados, que registram quando vocÃª clica em um link de produto para que a comissÃ£o seja corretamente atribuÃ­da.",
      },
      {
        h: "Como gerenciar",
        p: "VocÃª pode bloquear ou apagar cookies nas configuraÃ§Ãµes do seu navegador a qualquer momento. Lembre-se de que desativar alguns cookies pode afetar funcionalidades do site.",
      },
    ],
  },
  affiliate: {
    key: "affiliate",
    title: "DivulgaÃ§Ã£o de Links de Afiliados",
    updated: "1 jun 2026",
    sections: [
      {
        h: "DivulgaÃ§Ã£o (modelo FTC / LGPD)",
        p: "Em conformidade com as diretrizes da FTC e a legislaÃ§Ã£o brasileira, informamos de forma clara: o Guia Jardineiro contÃ©m links de afiliados. Quando vocÃª compra atravÃ©s deles, podemos receber uma comissÃ£o, sem qualquer custo adicional para vocÃª.",
      },
      {
        h: "Programa de Associados da Amazon",
        p: "Participamos do Programa de Associados da Amazon, um programa de publicidade que nos permite ganhar comissÃµes por meio de links para o site da Amazon e produtos qualificados.",
      },
      {
        h: "Nossa independÃªncia",
        p: "As comissÃµes ajudam a manter o site e a financiar novos testes, mas nunca influenciam nossa opiniÃ£o. As recomendaÃ§Ãµes e posiÃ§Ãµes nos rankings sÃ£o definidas exclusivamente pela nossa avaliaÃ§Ã£o editorial independente.",
      },
      {
        h: "IdentificaÃ§Ã£o dos links",
        p: "Sempre que possÃ­vel, sinalizamos os links e botÃµes de compra como recomendaÃ§Ãµes comerciais. Em caso de dÃºvida, escreva para contato@guiajardineiro.com.br.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Lookup helpers                                                      */
/* ------------------------------------------------------------------ */

export const getCategoryById = (id: string) =>
  categories.find((c) => c.id === id);
export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
export const getAuthorById = (id: string) => authors.find((a) => a.id === id);
export const getAuthorBySlug = (slug: string) =>
  authors.find((a) => a.slug === slug);
export const getProductById = (id: string) =>
  products.find((p) => p.id === id);
