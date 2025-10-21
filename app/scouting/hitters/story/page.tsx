import { SourceBadge, MockDataBanner } from '@/components/Badges';

export default function HittersStory() {
  return (
    <div className="space-y-6">
      <header>
        <div className="eyebrow">Scouting · Hitters</div>
        <h1 className="headline text-3xl">Story Mode</h1>
        <MockDataBanner />
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <article className="card p-5">
          <h3 className="font-semibold mb-1">Swing Decisions</h3>
          <p className="text-sm text-muted mb-3">O-swing, Z-swing, take quality, 2-strike profile.</p>
          <div className="flex gap-2"><SourceBadge source="TruMedia" /><SourceBadge source="Savant" /></div>
        </article>

        <article className="card p-5">
          <h3 className="font-semibold mb-1">Contact Quality</h3>
          <p className="text-sm text-muted mb-3">EV/LA, HH%, xwOBA, spray.</p>
          <div className="flex gap-2"><SourceBadge source="Savant" /><SourceBadge source="FanGraphs" /></div>
        </article>

        <article className="card p-5">
          <h3 className="font-semibold mb-1">Pitch-Type Outcomes</h3>
          <p className="text-sm text-muted mb-3">Run values vs pitch families.</p>
          <div className="flex gap-2"><SourceBadge source="TruMedia" /></div>
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
