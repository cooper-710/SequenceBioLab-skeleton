import { SourceBadge, MockDataBanner } from '@/components/Badges';

export default function PitchersStory() {
  return (
    <div className="space-y-6">
      <header>
        <div className="eyebrow">Scouting · Pitchers</div>
        <h1 className="headline text-3xl">Story Mode</h1>
        <MockDataBanner />
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <article className="card p-5">
          <h3 className="font-semibold mb-1">Arsenal Quality</h3>
          <p className="text-sm text-muted mb-3">Movement, velocity bands, command proxy.</p>
          <div className="flex gap-2"><SourceBadge source="Savant" /><SourceBadge source="TruMedia" /></div>
        </article>

        <article className="card p-5">
          <h3 className="font-semibold mb-1">Tunneling & Release Spread</h3>
          <p className="text-sm text-muted mb-3">Release cluster, approach angle, divergence.</p>
          <div className="flex gap-2"><SourceBadge source="Savant" /><SourceBadge source="FanGraphs" /></div>
        </article>

        <article className="card p-5">
          <h3 className="font-semibold mb-1">Situational Edge</h3>
          <p className="text-sm text-muted mb-3">Count strategy, L/R splits, chase leverage.</p>
          <div className="flex gap-2"><SourceBadge source="TruMedia" /><SourceBadge source="Sequence PDF" /></div>
        </article>

        <article className="card p-5">
          <h3 className="font-semibold mb-1">Projection</h3>
          <p className="text-sm text-muted mb-3">Role fit, comp archetypes, trend deltas.</p>
          <div className="flex gap-2"><SourceBadge source="FanGraphs" /></div>
        </article>
      </div>
    </div>
  );
}
