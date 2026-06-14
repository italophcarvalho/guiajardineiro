/**
 * Guia Jardineiro — legal document content
 *
 * Single source of truth for all four legal documents. Keyed by the URL slug
 * used in `/legal?doc=<slug>` so the legal page can deep-link directly.
 *
 * The affiliate disclosure (afiliados) is mandatory under LGPD and FTC rules
 * and must be clearly accessible from every article footer.
 */

export type LegalSlug = "privacidade" | "termos" | "cookies" | "afiliados";

export interface LegalSection {
  h: string;
  p: string;
}

export interface LegalDoc {
  slug: LegalSlug;
  title: string;
  updated: string;
  sections: LegalSection[];
}

export const legalNav: { slug: LegalSlug; label: string }[] = [
  { slug: "privacidade", label: "Política de Privacidade" },
  { slug: "termos", label: "Termos de Uso" },
  { slug: "cookies", label: "Política de Cookies" },
  { slug: "afiliados", label: "Divulgação de Links de Afiliados" },
];

export const legalContent: Record<LegalSlug, LegalDoc> = {
  privacidade: {
    slug: "privacidade",
    title: "Política de Privacidade",
    updated: "1 jun 2026",
    sections: [
      {
        h: "Quais dados coletamos",
        p: "Coletamos apenas o necessário: o e-mail que você fornece ao assinar a newsletter ou enviar mensagens pelo formulário de contato, além de dados de navegação anônimos — páginas visitadas, tipo de dispositivo e origem do acesso — para entender o que é útil para você.",
      },
      {
        h: "Como usamos seus dados",
        p: "Seu e-mail é usado exclusivamente para enviar os conteúdos que você solicitou e para responder às suas mensagens. Dados de navegação são agregados e utilizados apenas para melhorar o site. Nunca vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.",
      },
      {
        h: "Seus direitos (LGPD)",
        p: "Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o direito de acessar, corrigir ou solicitar a exclusão dos seus dados pessoais a qualquer momento. Para exercer esses direitos ou para cancelar a inscrição na newsletter, basta entrar em contato pelo e-mail privacidade@guiajardineiro.com.br.",
      },
      {
        h: "Cookies e rastreamento",
        p: "Utilizamos cookies essenciais para o funcionamento do site e cookies de análise para medir audiência de forma anônima. Parceiros de programas de afiliados podem registrar cliques para fins de atribuição de comissão. Veja detalhes na nossa Política de Cookies.",
      },
      {
        h: "Segurança dos dados",
        p: "Adotamos medidas técnicas e organizacionais adequadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. Em caso de incidente de segurança que possa afetar seus dados, você será notificado conforme previsto pela LGPD.",
      },
      {
        h: "Contato",
        p: "Em caso de dúvidas sobre esta política ou sobre o tratamento dos seus dados, entre em contato pelo e-mail privacidade@guiajardineiro.com.br. Respondemos em até 5 dias úteis.",
      },
    ],
  },

  termos: {
    slug: "termos",
    title: "Termos de Uso",
    updated: "1 jun 2026",
    sections: [
      {
        h: "Aceitação dos termos",
        p: "Ao acessar e utilizar o Guia Jardineiro, você declara ter lido, entendido e concordado com estes Termos de Uso. Se não concordar com algum ponto, pedimos que não utilize o site.",
      },
      {
        h: "Natureza do conteúdo",
        p: "O conteúdo publicado no Guia Jardineiro tem caráter informativo e reflete a opinião editorial baseada em testes práticos e pesquisa independente. Não substitui orientação técnica profissional para casos específicos de cultivo, diagnóstico de pragas ou uso de agroquímicos.",
      },
      {
        h: "Propriedade intelectual",
        p: "Textos, fotografias, vídeos e demais materiais originais publicados neste site são protegidos por direitos autorais. A reprodução parcial é permitida com crédito explícito e link para a página original. Reprodução integral sem autorização prévia é proibida.",
      },
      {
        h: "Links externos e afiliados",
        p: "O Guia Jardineiro contém links para sites externos, inclusive links de programas de afiliados. Não nos responsabilizamos pelo conteúdo, políticas ou práticas de sites de terceiros. Consulte nossa Divulgação de Links de Afiliados para entender como esses links funcionam.",
      },
      {
        h: "Limitação de responsabilidade",
        p: "Fazemos o possível para manter as informações corretas e atualizadas, mas não nos responsabilizamos por decisões de compra ou cultivo tomadas com base no conteúdo. Preços, especificações e disponibilidade de produtos nas lojas parceiras podem mudar sem aviso prévio.",
      },
      {
        h: "Modificações",
        p: "Reservamo-nos o direito de modificar estes Termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação. O uso continuado do site após modificações constitui aceite das novas condições.",
      },
    ],
  },

  cookies: {
    slug: "cookies",
    title: "Política de Cookies",
    updated: "1 jun 2026",
    sections: [
      {
        h: "O que são cookies",
        p: "Cookies são pequenos arquivos de texto que os sites armazenam no seu navegador. Eles permitem que o site lembre preferências, reconheça visitas recorrentes e meça como as páginas são utilizadas.",
      },
      {
        h: "Cookies essenciais",
        p: "São necessários para o funcionamento básico do site — por exemplo, para manter sessões e preferências de idioma. Não podem ser desativados sem comprometer o funcionamento do site.",
      },
      {
        h: "Cookies de análise",
        p: "Utilizamos ferramentas de análise de audiência (como Google Analytics ou Plausible) em modo anonimizado, sem coletar dados pessoais identificáveis. Esses cookies nos ajudam a entender quais conteúdos são mais úteis e como melhorar a experiência.",
      },
      {
        h: "Cookies de afiliados",
        p: "Quando você clica em um link de produto patrocinado, cookies de rastreamento são definidos pelas lojas parceiras (como Amazon) para registrar a origem do clique e atribuir corretamente as comissões. Esses cookies são de terceiros e estão sujeitos às políticas de privacidade de cada parceiro.",
      },
      {
        h: "Como gerenciar cookies",
        p: "Você pode bloquear, limitar ou excluir cookies a qualquer momento nas configurações do seu navegador. Lembre-se de que desativar cookies essenciais pode afetar funcionalidades do site. A maioria dos navegadores modernos também oferece modo de navegação privativa, que não armazena cookies após o fechamento da janela.",
      },
    ],
  },

  afiliados: {
    slug: "afiliados",
    title: "Divulgação de Links de Afiliados",
    updated: "1 jun 2026",
    sections: [
      {
        h: "Aviso de afiliados (FTC / LGPD)",
        p: "Em conformidade com as diretrizes da Federal Trade Commission (FTC) dos Estados Unidos e com a Lei Geral de Proteção de Dados (LGPD) do Brasil, informamos de forma clara e antecipada: o Guia Jardineiro contém links de afiliados. Isso significa que, quando você clica em um link de produto e realiza uma compra, podemos receber uma comissão — sem qualquer custo adicional para você.",
      },
      {
        h: "Programa de Associados da Amazon",
        p: "O Guia Jardineiro é participante do Programa de Associados da Amazon, um programa de publicidade por afiliados projetado para fornecer um meio de ganhar taxas de indicação vinculando-se a produtos da Amazon.com.br e sites afiliados.",
      },
      {
        h: "Nossa independência editorial",
        p: "As comissões de afiliado ajudam a cobrir os custos de operação do site e a financiar os testes práticos que realizamos. No entanto, a existência de um programa de afiliados nunca influencia nossas recomendações, classificações em rankings ou o conteúdo editorial. Os produtos são selecionados e avaliados exclusivamente com base no desempenho real nos nossos testes.",
      },
      {
        h: "Como identificar links de afiliados",
        p: "Links e botões de compra que levam a lojas parceiras (como 'Ver na Amazon' ou 'Ver melhor preço') são links de afiliado. Eles estão sempre claramente sinalizados pelo design do botão e, quando possível, marcados com o aviso de afiliado no início do artigo.",
      },
      {
        h: "Preços e disponibilidade",
        p: "Os preços exibidos nos artigos e cards de produto são atualizados periodicamente, mas podem não refletir o valor exato praticado no momento da sua visita. Sempre verifique o preço final na página do produto antes de concluir a compra.",
      },
      {
        h: "Dúvidas",
        p: "Se você tiver qualquer dúvida sobre nossos vínculos com parceiros comerciais, entre em contato pelo e-mail contato@guiajardineiro.com.br. Nosso compromisso é com a transparência total.",
      },
    ],
  },
};
