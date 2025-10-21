export function SourceBadge({ source }: { source: 'TruMedia'|'Savant'|'FanGraphs'|'Sequence PDF'|string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-border text-[11px] text-muted">
      {source}
    </span>
  );
}

export function MockDataBanner({ note = 'Sample data / placeholder' }: { note?: string }) {
  return <div className="mock-banner">{note}</div>;
}
