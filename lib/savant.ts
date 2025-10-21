// lib/savant.ts
import 'server-only';

/** Output we want to enrich the hitter report with */
export type SavantHitterQoC = {
  avgEV: number | null;
  maxEV: number | null;
  la: number | null;
  hardHitPct: number | null;
  barrelsPct: number | null;
  xwOBA: number | null;
};

const THIS_SEASON =
  new Date().getMonth() < 3 ? new Date().getFullYear() - 1 : new Date().getFullYear();

/**
 * Fetch Statcast/Savant quality-of-contact for a hitter.
 * Tries, in order:
 *  1) JSON leaderboard by MLB ID
 *  2) JSON leaderboard by player name
 *  3) CSV fallback by MLB ID (parse first row)
 */
export async function getHitterSavant(opts: {
  mlbid?: string;           // Recommended (from your /api/mlb/find-player)
  player: string;           // Fallback by name if id missing
  season?: number;          // Defaults to current MLB season (handles Jan–Mar rollover)
}): Promise<SavantHitterQoC> {
  const season = opts.season ?? THIS_SEASON;

  let out: SavantHitterQoC = {
    avgEV: null,
    maxEV: null,
    la: null,
    hardHitPct: null,
    barrelsPct: null,
    xwOBA: null,
  };

  // --- A) JSON by MLB ID ---------------------------------------------------
  try {
    if (opts.mlbid) {
      const urlA = `https://baseballsavant.mlb.com/leaderboard/api?type=batter&year=${season}&player_id=${opts.mlbid}`;
      const rA = await fetch(urlA, { next: { revalidate: 3600 } });
      if (rA.ok) {
        const j = await rA.json();
        const row = Array.isArray(j?.data) ? j.data[0] : undefined;
        if (row) return mapRow(row, out);
      }
    }
  } catch {
    /* noop – try next strategy */
  }

  // --- B) JSON by name ------------------------------------------------------
  try {
    const search = encodeURIComponent(opts.player);
    const urlB = `https://baseballsavant.mlb.com/leaderboard/api?type=batter&year=${season}&player=${search}`;
    const rB = await fetch(urlB, { next: { revalidate: 3600 } });
    if (rB.ok) {
      const j = await rB.json();
      const row = Array.isArray(j?.data) ? j.data[0] : undefined;
      if (row) return mapRow(row, out);
    }
  } catch {
    /* noop – try fallback */
  }

  // --- C) CSV fallback by MLB ID -------------------------------------------
  try {
    if (opts.mlbid) {
      const urlC = `https://baseballsavant.mlb.com/leaderboard/statcast?type=batter&year=${season}&player_id=${opts.mlbid}&csv=true`;
      const rC = await fetch(urlC, { next: { revalidate: 3600 } });
      if (rC.ok) {
        const text = (await rC.text()).trim();
        const [headerLine, dataLine] = text.split('\n');
        if (headerLine && dataLine) {
          const cols = headerLine.split(',');
          const vals = dataLine.split(',');
          const get = (key: string) => {
            const i = cols.findIndex(c => c.trim().toLowerCase() === key);
            return i >= 0 ? vals[i] : undefined;
          };
          return {
            avgEV: toNum(get('avg_ev')),
            maxEV: toNum(get('max_ev')),
            la: toNum(get('launch_angle_avg')),
            hardHitPct: toNum(get('hard_hit_percent')),
            barrelsPct: toNum(get('brl_percent')),
            xwOBA: toNum(get('xwoba')),
          };
        }
      }
    }
  } catch {
    /* final fallback returns whatever we already have (nulls) */
  }

  return out;
}

/* ---------------------------- helpers ---------------------------- */

function mapRow(row: any, base: SavantHitterQoC): SavantHitterQoC {
  return {
    ...base,
    avgEV: toNum(row.avg_ev),
    maxEV: toNum(row.max_ev),
    la: toNum(row.launch_angle_avg),
    hardHitPct: toNum(row.hard_hit_percent),
    barrelsPct: toNum(row.brl_percent),
    xwOBA: toNum(row.xwoba),
  };
}

function toNum(v: unknown): number | null {
  const n =
    typeof v === 'number'
      ? v
      : typeof v === 'string'
      ? parseFloat(v.replace('%', ''))
      : NaN;
  return Number.isFinite(n) ? n : null;
}
