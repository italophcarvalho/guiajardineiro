/**
 * Guia Jardineiro — mock analytics
 *
 * Three self-contained datasets (7d / 30d / 90d) for the admin Relatório
 * dashboard. Changing the period recalculates every section: KPIs, the page
 * views time series, category breakdown, traffic sources, affiliate revenue,
 * the conversion funnel and per-post performance.
 *
 * Numbers are stored raw (not pre-formatted) so the UI can sort and recompute
 * proportions; use the formatters at the bottom for display.
 */

export type RangeKey = "7d" | "30d" | "90d";

export interface Kpi {
  label: string;
  value: string;
  delta: string;
  /** true → ▲ green (positive), false → ▼ terracotta (negative). */
  up: boolean;
}

export interface CategoryStat {
  label: string;
  /** Raw page views for the period. */
  value: number;
}

export interface TrafficSource {
  label: string;
  pct: number;
  color: string;
}

export interface AffiliateStat {
  name: string;
  clicks: number;
  /** Estimated revenue in BRL for the period. */
  revenue: number;
}

export interface FunnelStage {
  label: string;
  value: number;
  /** Context line, e.g. "7,4% das views". */
  sub: string;
}

export interface PostPerf {
  title: string;
  category: string;
  views: number;
  /** Average time on page, e.g. "4m02s". */
  time: string;
  /** Affiliate click-through rate, e.g. "9,8%". */
  ctr: string;
  /** Estimated revenue in BRL. */
  revenue: number;
  /** Trend vs previous period, e.g. "+12,0%". */
  delta: string;
  up: boolean;
}

export interface AnalyticsDataset {
  rangeLabel: string;
  /** Page-views time series. */
  series: number[];
  /** X-axis labels (fewer than series points is fine — evenly spaced). */
  xLabels: string[];
  kpis: Kpi[];
  categories: CategoryStat[];
  sources: TrafficSource[];
  affiliates: AffiliateStat[];
  funnel: FunnelStage[];
  postRows: PostPerf[];
}

/* ------------------------------------------------------------------ */
/* Traffic sources — fixed distribution (per design spec)              */
/* ------------------------------------------------------------------ */

const SOURCES: TrafficSource[] = [
  { label: "Orgânico (SEO)", pct: 58, color: "#2D6A4F" },
  { label: "Social", pct: 18, color: "#40916C" },
  { label: "Direto", pct: 12, color: "#74C69D" },
  { label: "Newsletter", pct: 8, color: "#E8A02C" },
  { label: "Referência", pct: 4, color: "#C8541F" },
];

const POST_TITLES: { title: string; category: string; time: string; ctr: string }[] =
  [
    { title: "As 7 melhores tesouras de poda de 2026", category: "Ferramentas", time: "4m02s", ctr: "9,8%" },
    { title: "Os 5 melhores kits de irrigação", category: "Ferramentas", time: "3m55s", ctr: "8,4%" },
    { title: "Iluminação para plantas: luzes de cultivo", category: "Plantas de Interior", time: "4m12s", ctr: "7,9%" },
    { title: "Como montar uma horta de temperos", category: "Horta em Casa", time: "3m41s", ctr: "4,2%" },
    { title: "Suculentas para iniciantes", category: "Plantas de Interior", time: "2m58s", ctr: "3,1%" },
    { title: "Combate natural a pragas", category: "Pragas e Doenças", time: "2m44s", ctr: "2,2%" },
  ];

/* ------------------------------------------------------------------ */
/* Datasets                                                            */
/* ------------------------------------------------------------------ */

export const analytics: Record<RangeKey, AnalyticsDataset> = {
  "7d": {
    rangeLabel: "últimos 7 dias",
    series: [5800, 6200, 5400, 7100, 6800, 7600, 8200],
    xLabels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    kpis: [
      { label: "Visualizações", value: "42.380", delta: "+12,4%", up: true },
      { label: "Visitantes únicos", value: "28.910", delta: "+9,8%", up: true },
      { label: "Cliques afiliados", value: "3.142", delta: "+15,2%", up: true },
      { label: "Receita estimada", value: "R$ 4.870", delta: "+18,6%", up: true },
      { label: "Taxa de conversão", value: "7,4%", delta: "+0,4 pp", up: true },
      { label: "Tempo médio", value: "3m12s", delta: "+6s", up: true },
    ],
    categories: [
      { label: "Plantas de Interior", value: 12840 },
      { label: "Horta em Casa", value: 11600 },
      { label: "Ferramentas", value: 9720 },
      { label: "Pragas e Doenças", value: 5100 },
      { label: "Paisagismo", value: 2900 },
    ],
    sources: SOURCES,
    affiliates: [
      { name: 'Tesoura Bypass Pro 8"', clicks: 312, revenue: 1540 },
      { name: "Kit Irrigação Gotejamento", clicks: 221, revenue: 980 },
      { name: "Luminária LED Full Spectrum", clicks: 138, revenue: 890 },
      { name: "Adubo Orgânico Húmus 5kg", clicks: 256, revenue: 460 },
      { name: "Vaso Autoirrigável 5L", clicks: 174, revenue: 360 },
    ],
    funnel: [
      { label: "Visualizações de página", value: 42380, sub: "100%" },
      { label: "Cliques em produto", value: 3142, sub: "7,4% das views" },
      { label: "Saídas para a loja", value: 2070, sub: "65,9% dos cliques" },
      { label: "Conversões estimadas", value: 142, sub: "6,9% das saídas" },
    ],
    postRows: buildPostRows([
      [8420, 1540, "+14,2%", true],
      [5870, 980, "+9,1%", true],
      [4330, 890, "+11,4%", true],
      [6210, 220, "+5,0%", true],
      [6940, 120, "-2,3%", false],
      [3540, 60, "-4,1%", false],
    ]),
  },

  "30d": {
    rangeLabel: "últimos 30 dias",
    series: [
      4200, 4500, 4100, 4800, 5200, 4900, 5600, 5300, 6000, 5800, 5400, 6200,
      6500, 6100, 6800, 7200, 6900, 7400, 7100, 7800, 7500, 8200, 7900, 8600,
      8300, 9000, 8700, 9400, 9100, 9800,
    ],
    xLabels: ["12 mai", "19 mai", "26 mai", "2 jun", "9 jun"],
    kpis: [
      { label: "Visualizações", value: "186.540", delta: "+8,1%", up: true },
      { label: "Visitantes únicos", value: "121.300", delta: "+6,3%", up: true },
      { label: "Cliques afiliados", value: "13.820", delta: "+11,0%", up: true },
      { label: "Receita estimada", value: "R$ 21.430", delta: "+14,2%", up: true },
      { label: "Taxa de conversão", value: "7,1%", delta: "+0,2 pp", up: true },
      { label: "Tempo médio", value: "3m18s", delta: "+9s", up: true },
    ],
    categories: [
      { label: "Plantas de Interior", value: 56300 },
      { label: "Horta em Casa", value: 50900 },
      { label: "Ferramentas", value: 42600 },
      { label: "Pragas e Doenças", value: 22400 },
      { label: "Paisagismo", value: 14340 },
    ],
    sources: SOURCES,
    affiliates: [
      { name: 'Tesoura Bypass Pro 8"', clicks: 1240, revenue: 6820 },
      { name: "Kit Irrigação Gotejamento", clicks: 880, revenue: 4310 },
      { name: "Luminária LED Full Spectrum", clicks: 540, revenue: 3960 },
      { name: "Adubo Orgânico Húmus 5kg", clicks: 1020, revenue: 1940 },
      { name: "Vaso Autoirrigável 5L", clicks: 690, revenue: 1510 },
    ],
    funnel: [
      { label: "Visualizações de página", value: 186540, sub: "100%" },
      { label: "Cliques em produto", value: 13820, sub: "7,4% das views" },
      { label: "Saídas para a loja", value: 9110, sub: "65,9% dos cliques" },
      { label: "Conversões estimadas", value: 612, sub: "6,7% das saídas" },
    ],
    postRows: buildPostRows([
      [38420, 6820, "+12,0%", true],
      [22870, 4310, "+8,5%", true],
      [19330, 3960, "+10,2%", true],
      [31210, 980, "+6,4%", true],
      [28940, 540, "-1,8%", false],
      [16540, 210, "-3,5%", false],
    ]),
  },

  "90d": {
    rangeLabel: "últimos 90 dias",
    series: [
      3200, 3600, 4100, 3900, 4600, 5200, 5800, 6400, 7100, 7600, 8300, 9000,
      9800,
    ],
    xLabels: ["Mar", "Abr", "Mai", "Jun"],
    kpis: [
      { label: "Visualizações", value: "612.900", delta: "+21,5%", up: true },
      { label: "Visitantes únicos", value: "398.200", delta: "+17,9%", up: true },
      { label: "Cliques afiliados", value: "44.760", delta: "+24,3%", up: true },
      { label: "Receita estimada", value: "R$ 68.910", delta: "+28,1%", up: true },
      { label: "Taxa de conversão", value: "6,9%", delta: "-0,3 pp", up: false },
      { label: "Tempo médio", value: "3m09s", delta: "-4s", up: false },
    ],
    categories: [
      { label: "Plantas de Interior", value: 185000 },
      { label: "Horta em Casa", value: 167300 },
      { label: "Ferramentas", value: 140100 },
      { label: "Pragas e Doenças", value: 73500 },
      { label: "Paisagismo", value: 47000 },
    ],
    sources: SOURCES,
    affiliates: [
      { name: 'Tesoura Bypass Pro 8"', clicks: 4120, revenue: 22400 },
      { name: "Kit Irrigação Gotejamento", clicks: 2910, revenue: 14200 },
      { name: "Luminária LED Full Spectrum", clicks: 1780, revenue: 13050 },
      { name: "Adubo Orgânico Húmus 5kg", clicks: 3360, revenue: 6380 },
      { name: "Vaso Autoirrigável 5L", clicks: 2270, revenue: 4980 },
    ],
    funnel: [
      { label: "Visualizações de página", value: 612900, sub: "100%" },
      { label: "Cliques em produto", value: 44760, sub: "7,3% das views" },
      { label: "Saídas para a loja", value: 29450, sub: "65,8% dos cliques" },
      { label: "Conversões estimadas", value: 2030, sub: "6,9% das saídas" },
    ],
    postRows: buildPostRows([
      [121300, 22400, "+22,0%", true],
      [74600, 14200, "+18,3%", true],
      [61900, 13050, "+20,1%", true],
      [98700, 3180, "+12,9%", true],
      [86300, 1760, "-2,9%", false],
      [52400, 690, "-5,2%", false],
    ]),
  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type PostTuple = [views: number, revenue: number, delta: string, up: boolean];

function buildPostRows(rows: PostTuple[]): PostPerf[] {
  return rows.map(([views, revenue, delta, up], i) => ({
    title: POST_TITLES[i].title,
    category: POST_TITLES[i].category,
    time: POST_TITLES[i].time,
    ctr: POST_TITLES[i].ctr,
    views,
    revenue,
    delta,
    up,
  }));
}

/** Format an integer with pt-BR thousands separators. */
export function formatInt(n: number): string {
  return n.toLocaleString("pt-BR");
}

/** Format a BRL amount, e.g. 6820 → "R$ 6.820". */
export function formatBRL(n: number): string {
  return `R$ ${n.toLocaleString("pt-BR")}`;
}
