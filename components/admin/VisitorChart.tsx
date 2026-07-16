type VisitorChartProps = {
  data: { date: string; count: number }[];
};

function formatShortDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
}

export function VisitorChart({ data }: VisitorChartProps) {
  const width = 600;
  const height = 180;
  const padding = 20;

  const maxCount = Math.max(1, ...data.map((d) => d.count));
  const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    x: padding + i * stepX,
    y: height - padding - (d.count / maxCount) * (height - padding * 2),
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const lastPoint = points[points.length - 1];
  const areaPath =
    points.length > 1 && lastPoint
      ? `${linePath} L${lastPoint.x.toFixed(1)},${height - padding} L${padding},${height - padding} Z`
      : "";

  const totalVisits = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Kunjungan {data.length} hari terakhir
          </p>
          <p className="text-3xl font-black text-foreground">{totalVisits}</p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-4 h-auto w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="visitorChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {points.length > 1 && (
          <>
            <path d={areaPath} fill="url(#visitorChartFill)" stroke="none" />
            <path
              d={linePath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </>
        )}

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="var(--accent)" />
        ))}
      </svg>

      {data.length > 0 && (
        <div className="mt-2 flex justify-between text-xs text-subtle-foreground">
          <span>{formatShortDate(data[0].date)}</span>
          <span>{formatShortDate(data[data.length - 1].date)}</span>
        </div>
      )}
    </div>
  );
}
