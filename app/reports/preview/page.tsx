import Link from 'next/link';
import {
  getOnePagerData,
  type OnePagerType,
  type HitterOnePager,
  type PitcherOnePager,
} from '@/lib/reports';
import PrintButton from './PrintButton';

// safe formatter for numbers; returns "—" if null/undefined/NaN
function fmt(v: any, digits = 1, suffix = '') {
  const n = typeof v === 'number' ? v : Number.NaN;
  return Number.isFinite(n) ? `${n.toFixed(digits)}${suffix}` : '—';
}

// tiny helpers (server-safe)
function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div className="rounded-lg border border-border/40 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-medium leading-tight">{value}</div>
      {note ? <div className="text-xs text-muted-foreground mt-0.5">{note}</div> : null}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/40 p-4">
      <div className="text-sm font-medium mb-3">{title}</div>
      {children}
    </div>
  );
}

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const type = (searchParams.type as string) ?? '';
  const team = (searchParams.team as string) ?? '';
  const player = (searchParams.player as string) ?? '';

  const data = await getOnePagerData({
    type: (type as OnePagerType) || 'Hitter — One Pager',
    team,
    player,
  });

  const isHitter = type.startsWith('Hitter');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header (hidden in print via CSS) */}
      <div className="flex items-center justify-between mb-6 no-print">
        <h1 className="headline text-2xl">Preview — {type || 'Report'}</h1>
        <div className="flex gap-2">
          <Link
            href="/reports/generator"
            className="h-10 px-4 rounded-md border border-border/40 inline-flex items-center"
          >
            Back to form
          </Link>
          <PrintButton className="h-10 px-4 rounded-md bg-accent text-black font-medium" />
        </div>
      </div>

      {/* PRINTABLE AREA */}
      <div className="print-area">
        {/* Print-only title */}
        <div className="hidden print:block mb-4">
          <div className="text-xs text-muted-foreground">Sequence BioLab</div>
          <div className="text-xl font-semibold leading-tight">{type || 'Report'}</div>
          <div className="text-sm">
            <span className="font-medium">{team || '—'}</span> • {player || '—'}
          </div>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/60 p-6 space-y-6">
          {/* Meta strip */}
          <div className="grid md:grid-cols-3 gap-4">
            <Section title="Report Type">
              <div className="text-lg">{type || '—'}</div>
            </Section>
            <Section title="Team Code">
              <div className="text-lg">{team || '—'}</div>
            </Section>
            <Section title="Player">
              <div className="text-lg">{player || '—'}</div>
            </Section>
          </div>

          {/* Template body */}
          <div className="rounded-xl border border-dashed border-border/40 p-4 md:p-6">
            {isHitter ? (
              <HitterBody data={data as HitterOnePager} />
            ) : (
              <PitcherBody data={data as PitcherOnePager} />
            )}
          </div>

          {/* Raw JSON (hidden in print) */}
          <details className="mt-2 no-print">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Show raw JSON
            </summary>
            <pre className="mt-2 text-xs overflow-x-auto p-3 rounded-md bg-background/70 border border-border/40">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- HITTER LAYOUT ---------------------------- */

function HitterBody({ data }: { data: HitterOnePager }) {
  const q = data.qualityOfContact || {};
  const a = data.approach || {};
  const r = data.rates || {};
  const ov = data.overview || {};

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Section title="Overview">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Bats" value={ov.bats ?? '—'} />
          <Stat label="Height" value={ov.height ?? '—'} />
          <Stat label="Weight" value={ov.weight ?? '—'} note={ov.weight ? 'lbs' : undefined} />
          <Stat label="Age" value={ov.age ?? '—'} />
        </div>
      </Section>

      {/* Slash Line (REAL from MLB) */}
      <Section title="Slash Line (Season)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="AVG" value={fmt(r.avg, 3)} />
          <Stat label="OBP" value={fmt(r.obp, 3)} />
          <Stat label="SLG" value={fmt(r.slg, 3)} />
          <Stat label="OPS" value={fmt(r.ops, 3)} />
        </div>
      </Section>

      {/* Approach (REAL k%/bb%) */}
      <Section title="Approach">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="K%" value={fmt(a.kPct, 1, '%')} />
          <Stat label="BB%" value={fmt(a.bbPct, 1, '%')} />
          <Stat label="Chase%" value={fmt(a.chasePct, 1, '%')} />
          <Stat label="Zone Contact%" value={fmt(a.zoneContactPct, 1, '%')} />
        </div>
      </Section>

      {/* Quality of Contact (placeholders until Savant) */}
      <Section title="Quality of Contact (Savant soon)">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Stat label="Avg EV" value={fmt(q.avgEV, 1, ' mph')} />
          <Stat label="Max EV" value={fmt(q.maxEV, 1, ' mph')} />
          <Stat label="LA" value={fmt(q.la, 1, '°')} />
          <Stat label="HardHit%" value={fmt(q.hardHitPct, 1, '%')} />
          <Stat label="Barrels%" value={fmt(q.barrelsPct, 1, '%')} />
          <Stat label="xwOBA" value={fmt(q.xwOBA, 3)} />
        </div>
      </Section>

      {/* Batted Ball (placeholders until Savant) */}
      <Section title="Batted Ball Profile (Savant soon)">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Stat label="Pull%" value={fmt(data.battedBall.pullPct, 1, '%')} />
          <Stat label="Center%" value={fmt(data.battedBall.centPct, 1, '%')} />
          <Stat label="Oppo%" value={fmt(data.battedBall.oppoPct, 1, '%')} />
          <Stat label="GB%" value={fmt(data.battedBall.gbPct, 1, '%')} />
          <Stat label="FB%" value={fmt(data.battedBall.fbPct, 1, '%')} />
          <Stat label="LD%" value={fmt(data.battedBall.ldPct, 1, '%')} />
        </div>
      </Section>
    </div>
  );
}

/* ---------------------------- PITCHER LAYOUT --------------------------- */

function PitcherBody({ data }: { data: PitcherOnePager }) {
  const s = data.summary;

  return (
    <div className="space-y-6">
      <Section title="Summary">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Stat label="IP" value={fmt(s.ip, 1)} />
          <Stat label="K%" value={fmt(s.kPct, 1, '%')} />
          <Stat label="BB%" value={fmt(s.bbPct, 1, '%')} />
          <Stat label="ERA" value={fmt(s.era, 2)} />
          <Stat label="FIP" value={fmt(s.fip, 2)} />
          <Stat label="Whiff%" value={fmt(s.whiffPct, 1, '%')} />
        </div>
      </Section>

      <Section title="Arsenal">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr className="border-b border-border/40">
                <th className="py-2 pr-3 text-left">Pitch</th>
                <th className="py-2 pr-3 text-right">Usage%</th>
                <th className="py-2 pr-3 text-right">Velo</th>
                <th className="py-2 pr-3 text-right">Spin</th>
                <th className="py-2 pr-3 text-right">IVB</th>
                <th className="py-2 pr-3 text-right">HB</th>
                <th className="py-2 pr-3 text-right">Whiff%</th>
                <th className="py-2 pr-0 text-right">PutAway%</th>
              </tr>
            </thead>
            <tbody>
              {data.arsenal.map((p, i) => (
                <tr key={i} className="border-b border-border/20 last:border-0">
                  <td className="py-2 pr-3 font-medium">{p.pitch}</td>
                  <td className="py-2 pr-3 text-right">{fmt(p.usagePct, 1, '%')}</td>
                  <td className="py-2 pr-3 text-right">{fmt(p.velo, 1, ' mph')}</td>
                  <td className="py-2 pr-3 text-right">{fmt(p.spin, 0, ' rpm')}</td>
                  <td className="py-2 pr-3 text-right">{fmt(p.ivb, 1, '″')}</td>
                  <td className="py-2 pr-3 text-right">{fmt(p.hb, 1, '″')}</td>
                  <td className="py-2 pr-3 text-right">{fmt(p.whiffPct, 1, '%')}</td>
                  <td className="py-2 pr-0 text-right">{fmt(p.putAwayPct, 1, '%')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
