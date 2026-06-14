"use client";

import { useState, useEffect, useMemo } from "react";
import {
  analytics,
  formatInt,
  formatBRL,
  type RangeKey,
  type AnalyticsDataset,
} from "@/lib/mock-analytics";

const RANGES: { id: RangeKey; label: string }[] = [
  { id: "7d", label: "7 dias" },
  { id: "30d", label: "30 dias" },
  { id: "90d", label: "90 dias" },
];

export default function RelatorioPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const ds = analytics[range];

  // Re-trigger bar/area grow animations whenever the period changes.
  const [grow, setGrow] = useState(false);
  useEffect(() => {
    setGrow(false);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setGrow(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [range]);

  return (
    <div>
      {/* ============================================================
          HEADER
          ============================================================ */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-lora text-[26px] font-bold tracking-[-0.01em] text-green-900">
            Relatório de Performance
          </h1>
          <p className="mt-1 text-sm text-muted">
            Métricas do site e de cada post — {ds.rangeLabel}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex gap-0.5 rounded-[10px] border border-border-2 bg-surface p-[3px]">
            {RANGES.map((r) => {
              const active = r.id === range;
              return (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  aria-pressed={active}
                  className={[
                    "rounded-lg px-3.5 py-2 font-inter text-[13px] font-semibold transition-colors",
                    active
                      ? "bg-green-900 text-white"
                      : "bg-transparent text-[#3A5D45] hover:bg-green-tint",
                  ].join(" ")}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Export */}
          <button
            onClick={() => alert("Exportação disponível em breve.")}
            className="inline-flex items-center gap-2 rounded-[10px] border border-border-2 bg-surface px-3.5 py-2.5 font-inter text-[13px] font-semibold text-[#3A5D45] transition-colors hover:bg-green-tint"
          >
            <ExportIcon />
            Exportar
          </button>
        </div>
      </div>

      {/* ============================================================
          1. KPI CARDS
          ============================================================ */}
      <div className="mb-[18px] grid grid-cols-2 gap-4 lg:grid-cols-3">
        {ds.kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-card border border-border bg-surface px-5 py-4"
          >
            <div className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted">
              {k.label}
            </div>
            <div className="my-1.5 font-lora text-[28px] font-bold text-ink">
              {k.value}
            </div>
            <div
              className={[
                "inline-flex items-center gap-1 rounded-pill px-2.5 py-[3px] text-[12.5px] font-semibold",
                k.up
                  ? "bg-[#EAF1EA] text-[#2D6A4F]"
                  : "bg-[#FBF1E9] text-[#C8541F]",
              ].join(" ")}
            >
              <span aria-hidden="true">{k.up ? "▲" : "▼"}</span>
              {k.delta}
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================
          2. LINE CHART
          ============================================================ */}
      <Card className="mb-[18px]">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[16px] font-bold text-green-900">
            Visualizações de página
          </div>
          <span className="inline-flex items-center gap-1.5 text-[12.5px] text-muted">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-green-700" />
            Este período
          </span>
        </div>
        <LineChart dataset={ds} grow={grow} />
      </Card>

      {/* ============================================================
          3 + 4. CATEGORIES + TRAFFIC SOURCES
          ============================================================ */}
      <div
        className="mb-[18px] grid gap-[18px]"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {/* Categories */}
        <Card>
          <div className="mb-[18px] text-[16px] font-bold text-green-900">
            Visualizações por categoria
          </div>
          <div className="flex flex-col gap-[15px]">
            {ds.categories.map((c) => {
              const max = Math.max(...ds.categories.map((x) => x.value));
              const pct = Math.round((c.value / max) * 100);
              return (
                <div key={c.label}>
                  <div className="mb-1.5 flex justify-between text-[13px]">
                    <span className="font-semibold text-body-2">{c.label}</span>
                    <span className="text-muted">{formatInt(c.value)}</span>
                  </div>
                  <div className="h-[9px] overflow-hidden rounded-pill bg-[#F1EFE7]">
                    <div
                      className="h-full rounded-pill transition-[width] duration-[600ms] ease-out"
                      style={{
                        width: grow ? `${pct}%` : "0%",
                        background:
                          "linear-gradient(90deg,#2D6A4F,#40916C)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Traffic sources donut */}
        <Card>
          <div className="mb-3.5 text-[16px] font-bold text-green-900">
            Origem do tráfego
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Donut sources={ds.sources} />
            <div className="flex min-w-[140px] flex-1 flex-col gap-2.5">
              {ds.sources.map((s) => (
                <div key={s.label} className="flex items-center gap-2.5 text-[13px]">
                  <span
                    className="h-2.5 w-2.5 flex-none rounded-[3px]"
                    style={{ background: s.color }}
                  />
                  <span className="flex-1 font-semibold text-body-2">
                    {s.label}
                  </span>
                  <span className="text-muted">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ============================================================
          5 + 6. AFFILIATE CLICKS + FUNNEL
          ============================================================ */}
      <div
        className="mb-[18px] grid gap-[18px]"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {/* Affiliate vertical bars */}
        <Card>
          <div className="text-[16px] font-bold text-green-900">
            Cliques de afiliados por produto
          </div>
          <div className="mb-5 mt-1 text-[12.5px] text-muted-2">
            Receita estimada no período
          </div>
          <AffiliateBars dataset={ds} grow={grow} />
        </Card>

        {/* Funnel */}
        <Card>
          <div className="mb-[18px] text-[16px] font-bold text-green-900">
            Funil de conversão
          </div>
          <div className="flex flex-col gap-[18px]">
            {ds.funnel.map((f, i) => {
              const pct = Math.round((f.value / ds.funnel[0].value) * 100);
              const colors = ["#1B4332", "#2D6A4F", "#40916C", "#74C69D"];
              return (
                <div key={f.label}>
                  <div className="mb-2 flex items-baseline justify-between gap-2.5">
                    <span className="text-[13.5px] font-semibold text-body-2">
                      {f.label}
                    </span>
                    <span className="whitespace-nowrap">
                      <strong className="font-lora text-[17px] text-green-900">
                        {formatInt(f.value)}
                      </strong>{" "}
                      <span className="text-[11.5px] text-muted-2">
                        · {f.sub}
                      </span>
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-pill bg-[#F1EFE7]">
                    <div
                      className="h-full rounded-pill transition-[width] duration-[600ms] ease-out"
                      style={{
                        width: grow ? `${pct}%` : "0%",
                        background: colors[i] ?? "#74C69D",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ============================================================
          7. PER-POST PERFORMANCE TABLE
          ============================================================ */}
      <PostPerformanceTable dataset={ds} />
    </div>
  );
}

/* ================================================================== */
/* Card wrapper                                                        */
/* ================================================================== */

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-card-lg border border-border bg-surface p-[22px] sm:px-6 ${className}`}
    >
      {children}
    </div>
  );
}

/* ================================================================== */
/* Section 2 — SVG line chart                                          */
/* ================================================================== */

const CHART_W = 760;
const CHART_H = 240;

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    // Catmull-Rom → cubic bezier control points.
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function LineChart({
  dataset,
  grow,
}: {
  dataset: AnalyticsDataset;
  grow: boolean;
}) {
  const { series, xLabels } = dataset;
  const pl = 6,
    pr = 6,
    pt = 20,
    pb = 8;
  const n = series.length;
  const max = Math.max(...series) * 1.12;

  const points = series.map((v, i) => ({
    x: pl + (i * (CHART_W - pl - pr)) / Math.max(n - 1, 1),
    y: CHART_H - pb - (v / max) * (CHART_H - pt - pb),
  }));

  const linePath = buildSmoothPath(points);
  const areaPath =
    linePath +
    ` L ${points[n - 1].x.toFixed(1)} ${CHART_H - pb} L ${points[0].x.toFixed(1)} ${CHART_H - pb} Z`;

  // 5 horizontal gridlines.
  const gridYs = [0, 0.25, 0.5, 0.75, 1].map(
    (f) => pt + f * (CHART_H - pt - pb)
  );

  const showDots = n <= 10;

  return (
    <div>
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        preserveAspectRatio="none"
        className="block h-[240px] w-full"
        role="img"
        aria-label="Gráfico de visualizações de página"
      >
        <defs>
          <linearGradient id="gjArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {gridYs.map((y, i) => (
          <line
            key={i}
            x1="0"
            y1={y}
            x2={CHART_W}
            y2={y}
            stroke="#EFEDE4"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#gjArea)"
          style={{
            opacity: grow ? 1 : 0,
            transition: "opacity 600ms ease-out",
          }}
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#2D6A4F"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Dots (only ≤10 samples) */}
        {showDots &&
          points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#fff"
              stroke="#2D6A4F"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          ))}
      </svg>

      {/* X labels */}
      <div className="mt-1 flex justify-between text-[11.5px] text-muted-2">
        {xLabels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Section 4 — Donut                                                   */
/* ================================================================== */

function Donut({
  sources,
}: {
  sources: { label: string; pct: number; color: string }[];
}) {
  const r = 58;
  const C = 2 * Math.PI * r;
  const largest = sources.reduce((a, b) => (b.pct > a.pct ? b : a), sources[0]);

  let acc = 0;
  const segments = sources.map((s) => {
    const len = (s.pct / 100) * C;
    const seg = { color: s.color, dash: `${len} ${C - len}`, offset: -acc };
    acc += len;
    return seg;
  });

  return (
    <svg width="160" height="160" viewBox="0 0 200 200" className="flex-none">
      <g transform="rotate(-90 100 100)">
        <circle cx="100" cy="100" r={r} fill="none" stroke="#F1EFE7" strokeWidth="20" />
        {segments.map((s, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="20"
            strokeDasharray={s.dash}
            strokeDashoffset={s.offset}
          />
        ))}
      </g>
      <text
        x="100"
        y="96"
        textAnchor="middle"
        className="fill-green-900 font-lora text-[26px] font-bold"
      >
        {largest.pct}%
      </text>
      <text
        x="100"
        y="118"
        textAnchor="middle"
        className="fill-muted-2 font-inter text-[12px]"
      >
        {largest.label.split(" ")[0]}
      </text>
    </svg>
  );
}

/* ================================================================== */
/* Section 5 — Affiliate vertical bars                                 */
/* ================================================================== */

function AffiliateBars({
  dataset,
  grow,
}: {
  dataset: AnalyticsDataset;
  grow: boolean;
}) {
  const max = Math.max(...dataset.affiliates.map((a) => a.revenue));

  return (
    <div className="flex items-end justify-between gap-3" style={{ height: 220 }}>
      {dataset.affiliates.map((a) => {
        const pct = Math.round((a.revenue / max) * 100);
        return (
          <div
            key={a.name}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-2 text-center"
            title={a.name}
          >
            {/* Value labels */}
            <div className="leading-tight">
              <div className="font-lora text-[14px] font-bold text-green-900">
                {formatBRL(a.revenue)}
              </div>
              <div className="text-[11px] text-muted-2">
                {formatInt(a.clicks)} cliques
              </div>
            </div>

            {/* Bar */}
            <div
              className="w-full max-w-[46px] rounded-t-[8px] bg-terracotta transition-[height,background-color] duration-[600ms] ease-out group-hover:bg-terracotta-hover"
              style={{ height: grow ? `${pct}%` : "0%" }}
            />

            {/* Name */}
            <div className="line-clamp-2 h-8 text-[11px] font-semibold leading-tight text-body-2">
              {a.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/* Section 7 — Sortable per-post performance table                    */
/* ================================================================== */

function PostPerformanceTable({ dataset }: { dataset: AnalyticsDataset }) {
  const [sortDesc, setSortDesc] = useState(true);

  const sorted = useMemo(() => {
    const rows = [...dataset.postRows];
    rows.sort((a, b) => (sortDesc ? b.views - a.views : a.views - b.views));
    return rows;
  }, [dataset, sortDesc]);

  return (
    <div className="overflow-hidden rounded-card-lg border border-border bg-surface">
      <div className="border-b border-[#EFEDE4] px-[22px] py-[18px] text-[16px] font-bold text-green-900">
        Desempenho por post
      </div>
      <div className="gj-scroll overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-[13.5px]">
          <thead>
            <tr className="text-left text-[11.5px] uppercase tracking-[0.04em] text-muted">
              <th className="px-[22px] py-3 font-semibold">Post</th>
              <th className="px-3 py-3 text-right font-semibold">
                <button
                  onClick={() => setSortDesc((d) => !d)}
                  className="inline-flex items-center gap-1 uppercase tracking-[0.04em] transition-colors hover:text-green-700"
                  title="Ordenar por views"
                >
                  Views
                  <span aria-hidden="true" className="text-[10px]">
                    {sortDesc ? "▼" : "▲"}
                  </span>
                </button>
              </th>
              <th className="px-3 py-3 text-right font-semibold">Tempo médio</th>
              <th className="px-3 py-3 text-right font-semibold">CTR afiliado</th>
              <th className="px-3 py-3 text-right font-semibold">Receita</th>
              <th className="px-[22px] py-3 text-center font-semibold">Tend.</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.title} className="border-t border-[#F0EEE6]">
                <td className="max-w-[320px] px-[22px] py-3.5">
                  <div className="font-semibold leading-[1.3] text-ink">
                    {r.title}
                  </div>
                  <div className="mt-[3px] text-[11.5px] font-semibold uppercase tracking-[0.03em] text-terracotta">
                    {r.category}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right font-semibold text-ink">
                  {formatInt(r.views)}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right text-[#4A5249]">
                  {r.time}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right text-[#4A5249]">
                  {r.ctr}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right font-bold text-green-900">
                  {formatBRL(r.revenue)}
                </td>
                <td className="px-[22px] py-3.5 text-center">
                  <span
                    className="inline-flex items-center gap-1 text-[12.5px] font-semibold"
                    style={{ color: r.up ? "#2D6A4F" : "#C8541F" }}
                  >
                    <span aria-hidden="true">{r.up ? "▲" : "▼"}</span>
                    {r.delta}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Icons                                                              */
/* ================================================================== */

function ExportIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}
