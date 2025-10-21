// lib/reports.ts
import 'server-only';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type OnePagerType = 'Hitter — One Pager' | 'Pitcher — One Pager';

export type HitterOnePager = {
  meta: { team: string; player: string; type: OnePagerType };
  overview: { bats?: string; height?: string; weight?: number; age?: number };
  /** From Savant when available; some fields may be null if no leaderboard row. */
  qualityOfContact: {
    avgEV?: number | null;
    maxEV?: number | null;
    la?: number | null;
    hardHitPct?: number | null;
    barrelsPct?: number | null;
    xwOBA?: number | null;
  };
  /** MLB K/BB + Savant plate discipline when available. */
  approach: {
    kPct: number;
    bbPct: number;
    chasePct?: number | null;
    zoneContactPct?: number | null;
  };
  /** From Savant batted-ball leaderboard when available. */
  battedBall: {
    pullPct?: number | null;
    centPct?: number | null;
    oppoPct?: number | null;
    gbPct?: number | null;
    fbPct?: number | null;
    ldPct?: number | null;
  };
  /** Slash line from MLB Stats API */
  rates?: {
    avg?: number | null;
    obp?: number | null;
    slg?: number | null;
    ops?: number | null;
  };
};

export type PitcherOnePager = {
  meta: { team: string; player: string; type: OnePagerType };
  summary: {
    ip: number;
    kPct: number;
    bbPct: number;
    era: number;
    fip: number;
    whiffPct: number;
  };
  arsenal: Array<{
    pitch: string;
    usagePct: number;
    velo: number;
    spin: number;
    ivb: number;
    hb: number;
    whiffPct: number;
    putAwayPct: number;
  }>;
};

type GetArgs = { type: OnePagerType; team: string; player: string };

/* ------------------------------------------------------------------ */
/* Hitter (MLB + Savant merge)                                        */
/* ------------------------------------------------------------------ */

async function getHitterFromMLB(team: string, player: string): Promise<HitterOnePager> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const normalizedBase = base.replace(/\/$/, '');

  // Fetch MLB (bio + K/BB + slash) and Savant (EV/LA/HardHit/Barrels + batted ball + plate discipline)
  const [mlbRes, savRes] = await Promise.all([
    fetch(
      `${normalizedBase}/api/mlb/hitter?player=${encodeURIComponent(player)}${
        team ? `&team=${encodeURIComponent(team)}` : ''
      }`,
      { cache: 'no-store' }
    ),
    fetch(
      `${normalizedBase}/api/savant/hitter?player=${encodeURIComponent(player)}${
        team ? `&team=${encodeURIComponent(team)}` : ''
      }`,
      { cache: 'no-store' }
    ),
  ]);

  if (!mlbRes.ok) {
    throw new Error(`Hitter (MLB) fetch failed: ${mlbRes.status} ${mlbRes.statusText}`);
  }

  const mlb = await mlbRes.json();
  const sav = savRes.ok ? await savRes.json() : null;

  const q = sav?.qualityOfContact ?? {};
  const pd = sav?.approach ?? {};
  const bb = sav?.battedBall ?? {};

  return {
    meta: {
      team: mlb?.meta?.team ?? team ?? '—',
      player: mlb?.meta?.player ?? player ?? '—',
      type: 'Hitter — One Pager',
    },
    overview: {
      bats: mlb?.overview?.bats ?? undefined,
      height: mlb?.overview?.height ?? undefined,
      weight: mlb?.overview?.weight ?? undefined,
      age: mlb?.overview?.age ?? undefined,
    },
    qualityOfContact: {
      avgEV: q.avgEV ?? null,
      maxEV: q.maxEV ?? null,
      la: q.la ?? null,
      hardHitPct: q.hardHitPct ?? null,
      barrelsPct: q.barrelsPct ?? null,
      xwOBA: q.xwOBA ?? null,
    },
    approach: {
      kPct: Number(mlb?.approach?.kPct ?? 0),
      bbPct: Number(mlb?.approach?.bbPct ?? 0),
      chasePct: pd.chasePct ?? null,
      zoneContactPct: pd.zoneContactPct ?? null,
    },
    battedBall: {
      pullPct: bb.pullPct ?? null,
      centPct: bb.centPct ?? null,
      oppoPct: bb.oppoPct ?? null,
      gbPct: bb.gbPct ?? null,
      fbPct: bb.fbPct ?? null,
      ldPct: bb.ldPct ?? null,
    },
    rates: {
      avg: mlb?.rates?.avg ?? null,
      obp: mlb?.rates?.obp ?? null,
      slg: mlb?.rates?.slg ?? null,
      ops: mlb?.rates?.ops ?? null,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Pitcher (placeholder for now)                                      */
/* ------------------------------------------------------------------ */

function tempPitcher(team: string, player: string): PitcherOnePager {
  return {
    meta: { team, player, type: 'Pitcher — One Pager' },
    summary: { ip: 0, kPct: 0, bbPct: 0, era: 0, fip: 0, whiffPct: 0 },
    arsenal: [],
  };
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

export async function getOnePagerData(
  { type, team, player }: GetArgs
): Promise<HitterOnePager | PitcherOnePager> {
  if (type.startsWith('Hitter')) {
    return getHitterFromMLB(team, player);
  }
  // We'll wire real pitcher data next.
  return tempPitcher(team, player);
}
