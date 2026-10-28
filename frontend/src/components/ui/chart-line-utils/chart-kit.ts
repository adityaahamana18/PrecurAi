/**
 * chart-kit.ts — shared primitives for PrecurAi chart components.
 * Adapted from the HextaUI chart-kit reference implementation.
 */

import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Point = [number, number];
export type ChartCurve = "smooth" | "linear" | "step";
export type ChartDatum = Record<string, unknown>;
export type ValueFormat =
  | "number"
  | "currency"
  | "percent"
  | "compact"
  | ((v: number) => string);

export interface ChartSeries {
  key: string;
  label?: string;
  color?: string;
}

export interface ChartBaseProps {
  title?: string;
  description?: string;
  titleSize?: "sm" | "md" | "lg";
  surface?: "dark" | "light";
  accent?: string;
  palette?: string[];
  icon?: React.ReactNode;
  radius?: number;
  bare?: boolean;
  animate?: boolean;
  duration?: number;
  delay?: number;
  once?: boolean;
  valueFormat?: ValueFormat;
  currency?: string;
  decimals?: number;
  className?: string;
}

// ─── Theme ────────────────────────────────────────────────────────────────────

const DARK_PALETTE = [
  "#38bdf8", // sky-400
  "#f97316", // orange-400
  "#a78bfa", // violet-400
  "#34d399", // emerald-400
  "#fb7185", // rose-400
  "#facc15", // yellow-400
];

const LIGHT_PALETTE = [
  "#0284c7",
  "#ea580c",
  "#7c3aed",
  "#059669",
  "#e11d48",
  "#ca8a04",
];

export function chartTheme(
  surface: "dark" | "light" = "dark",
  accent?: string
) {
  const dark = surface === "dark";
  return {
    bg: dark ? "#0F172A" : "#ffffff",
    card: dark ? "#111827" : "#f8fafc",
    fg: dark ? "#f1f5f9" : "#0f172a",
    muted: dark ? "#94a3b8" : "#64748b",
    grid: dark ? "#1e293b" : "#e2e8f0",
    subtle: dark ? "#334155" : "#cbd5e1",
    accent: accent ?? (dark ? "#38bdf8" : "#0284c7"),
    palette: dark ? DARK_PALETTE : LIGHT_PALETTE,
  };
}

// ─── Resolve series colors ────────────────────────────────────────────────────

export function resolveSeries(
  series: ChartSeries[],
  theme: ReturnType<typeof chartTheme>,
  palette?: string[]
) {
  const colors = palette ?? theme.palette;
  return series.map((s, i) => ({
    key: s.key,
    label: s.label ?? s.key,
    color: s.color ?? colors[i % colors.length],
  }));
}

// ─── Ticks ────────────────────────────────────────────────────────────────────

export function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) return [min];
  const range = max - min;
  const step = niceStep(range / Math.max(count - 1, 1));
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + 1e-9; v += step) {
    ticks.push(Math.round(v * 1e6) / 1e6);
  }
  return ticks;
}

function niceStep(rough: number): number {
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const f = rough / mag;
  if (f < 1.5) return mag;
  if (f < 3.5) return 2 * mag;
  if (f < 7.5) return 5 * mag;
  return 10 * mag;
}

// ─── Path builder ─────────────────────────────────────────────────────────────

export function linePath(pts: Point[], curve: ChartCurve = "smooth"): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M${pts[0][0]},${pts[0][1]}`;
  if (curve === "linear") {
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  }
  if (curve === "step") {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` H${pts[i][0]} V${pts[i][1]}`;
    }
    return d;
  }
  // smooth (cubic bezier)
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) / 3;
    const cp1y = pts[i][1];
    const cp2x = pts[i + 1][0] - (pts[i + 1][0] - pts[i][0]) / 3;
    const cp2y = pts[i + 1][1];
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

// ─── Formatter ────────────────────────────────────────────────────────────────

export function createFormatter(
  format: ValueFormat,
  opts: { currency?: string; decimals?: number } = {}
): (v: number) => string {
  if (typeof format === "function") return format;

  if (format === "currency") {
    const intl = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: opts.currency ?? "USD",
      maximumFractionDigits: opts.decimals ?? 0,
    });
    return (v) => intl.format(v);
  }

  if (format === "percent") {
    const intl = new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumFractionDigits: opts.decimals ?? 1,
    });
    return (v) => intl.format(v / 100);
  }

  if (format === "compact") {
    const intl = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: opts.decimals ?? 1,
    });
    return (v) => intl.format(v);
  }

  // number
  const intl = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: opts.decimals ?? 0,
  });
  return (v) => intl.format(v);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

// ─── Reveal hook ─────────────────────────────────────────────────────────────

export function useChartReveal(once: boolean, animated: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(!animated);
  const still = !animated;

  useEffect(() => {
    if (!animated) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animated, once]);

  return { ref, shown, still };
}

// ─── Tooltip component ────────────────────────────────────────────────────────

interface TooltipRow {
  label: string;
  value: string;
  color: string;
}

interface ChartTooltipProps {
  open: boolean;
  x: number;
  y: number;
  width: number;
  title?: string;
  rows: TooltipRow[];
  theme: ReturnType<typeof chartTheme>;
}

export function ChartTooltip({
  open,
  x,
  y,
  width,
  title,
  rows,
  theme,
}: ChartTooltipProps) {
  if (!open || rows.length === 0) return null;
  const TW = 160;
  const left = x + TW / 2 > width ? x - TW - 8 : x + 8;
  return (
    <div
      className="pointer-events-none absolute z-50 rounded-xl border px-3 py-2.5 shadow-2xl text-xs"
      style={{
        left,
        top: y - 20,
        minWidth: TW,
        background: theme.card,
        borderColor: theme.subtle,
        color: theme.fg,
      }}
    >
      {title && (
        <div className="font-semibold mb-1.5 text-[11px]" style={{ color: theme.muted }}>
          {title}
        </div>
      )}
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5" style={{ color: theme.muted }}>
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ background: r.color }}
            />
            {r.label}
          </span>
          <span className="font-bold tabular-nums" style={{ color: theme.fg }}>
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

interface LegendSeries {
  key: string;
  label: string;
  color: string;
  texture?: string;
}

export function ChartLegend({
  series,
  theme,
  hidden,
  onToggle,
}: {
  series: LegendSeries[];
  theme: ReturnType<typeof chartTheme>;
  hidden: Set<string>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {series.map((s) => (
        <button
          key={s.key}
          onClick={() => onToggle(s.key)}
          className="flex items-center gap-1.5 text-xs rounded px-2 py-1 transition-opacity"
          style={{
            color: hidden.has(s.key) ? theme.muted : theme.fg,
            opacity: hidden.has(s.key) ? 0.45 : 1,
          }}
        >
          <span
            className="inline-block w-3 h-0.5 rounded-full"
            style={{ background: s.color }}
          />
          {s.label}
        </button>
      ))}
    </div>
  );
}

// ─── Pattern fill ─────────────────────────────────────────────────────────────

export function ChartPattern({
  id,
  color,
  texture,
  theme,
}: {
  id: string;
  color: string;
  texture: string;
  theme: ReturnType<typeof chartTheme>;
}) {
  if (texture === "hatch") {
    return (
      <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeOpacity={0.3} strokeWidth={2} />
      </pattern>
    );
  }
  return (
    <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill={color} fillOpacity={0.4} />
    </pattern>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

interface ChartCardProps {
  theme: ReturnType<typeof chartTheme>;
  title?: string;
  description?: string;
  titleSize?: "sm" | "md" | "lg";
  value?: React.ReactNode;
  delta?: number;
  icon?: React.ReactNode;
  radius?: number;
  bare?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function ChartCard({
  theme,
  title,
  description,
  titleSize = "md",
  value,
  delta,
  icon,
  radius = 16,
  bare = false,
  className = "",
  children,
}: ChartCardProps) {
  const titleSizeMap = { sm: "text-xs", md: "text-sm", lg: "text-base" };
  const positive = delta !== undefined && delta >= 0;

  if (bare) {
    return <div className={`w-full ${className}`}>{children}</div>;
  }

  return (
    <div
      className={`w-full border p-5 flex flex-col gap-3 ${className}`}
      style={{
        background: theme.card,
        borderColor: theme.subtle,
        borderRadius: radius,
      }}
    >
      {(title || value) && (
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {title && (
              <div className={`font-semibold truncate ${titleSizeMap[titleSize]}`} style={{ color: theme.fg }}>
                {title}
              </div>
            )}
            {description && (
              <div className="text-[11px] mt-0.5" style={{ color: theme.muted }}>
                {description}
              </div>
            )}
            {value && (
              <div className="mt-1 text-2xl font-bold tabular-nums" style={{ color: theme.fg }}>
                {value}
                {delta !== undefined && (
                  <span
                    className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{
                      color: positive ? "#34d399" : "#f87171",
                      background: positive ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
                    }}
                  >
                    {positive ? "+" : ""}{delta.toFixed(1)}%
                  </span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div
              className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${theme.accent}22`, color: theme.accent }}
            >
              {icon}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
