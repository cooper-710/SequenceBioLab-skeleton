import { MockDataBanner } from '@/components/Badges';

export default function HittersDeepDive() {
  return (
    <div className="space-y-6">
      <header>
        <div className="eyebrow">Scouting · Hitters</div>
        <h1 className="headline text-3xl">Deep Dive</h1>
        <MockDataBanner note="Filters, comps, pivots will be wired to live data." />
      </header>
      <div className="grid md:grid-cols-3 gap-4">
        <section className="card p-5">
          <h3 className="font-semibold mb-2">Filters</h3>
          <p className="text-sm text-muted">Season, split, pitch type, count, zone…</p>
        </section>
        <section className="card p-5 md:col-span-2">
          <h3 className="font-semibold mb-2">Table/Chart</h3>
          <p className="text-sm text-muted">Materialized views → fast queries.</p>
        </section>
      </div>
    </div>
  );
}
