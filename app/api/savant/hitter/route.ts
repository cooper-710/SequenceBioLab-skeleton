// app/api/savant/hitter/route.ts
import { NextResponse } from 'next/server';

// --- tiny CSV parser (robust to commas in quotes)
function parseCSV(text: string): Array<Record<string, string>> {
  const rows: string[] = [];
  let cur = '', inQ = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (c === '"' && n === '"') { cur += '"'; i++; continue; }
    if (c === '"') { inQ = !inQ; continue; }
    if (!inQ && c === '\n') { rows.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur) rows.push(cur);

  const header = (rows.shift() ?? '').split(',').map(h =>
    h.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')
  );

  return rows.filter(Boolean).map(line => {
    const vals: string[] = [];
    let v = '', q = false;

    for (let i = 0; i < line.length; i++) {
      const c = line[i], n = line[i + 1];
      if (c === '"' && n === '"') { v += '"'; i++; continue; }
      if (c === '"') { q = !q; continue; }
      if (!q && c === ',') { vals.push(v); v = ''; continue; }
      v += c;
    }
    vals.push(v);

    const obj: Record<string, string> = {};
    header.forEach((h, i) => (obj[h] = (vals[i] ?? '').trim()));
    return obj;
  });
}

async function getCSV(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${res.statusText} for ${url}`);
  return parseCSV(await res.text());
}

function toNum(x: string | undefined | null): number | null {
  if (x == null) return null;
  const n = Number(String(x).replace(/[%"]/g, ''));
  return Number.isFinite(n) ? n : null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const season = Number(searchParams.get('season')) || new Date().getFullYear();
    const mlbid = searchParams.get('mlbid')?.trim();
    const player = searchParams.get('player')?.trim();
    const team = searchParams.get('team')?.trim();

    if (!mlbid && !player) {
      return NextResponse.json({ error: 'Provide ?mlbid= or ?player=' }, { status: 400 });
    }

    // If no mlbid, try your local ID lookup helper first.
    let id = mlbid ?? null;
    if (!id && player) {
      const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const r = await fetch(`${base.replace(/\/$/, '')}/api/mlb/player-id?player=${encodeURIComponent(player)}`, { cache: 'no-store' });
      if (r.ok) {
        const j = await r.json();
        if (j?.id) id = String(j.id);
      }
    }
    if (!id) return NextResponse.json({ error: `Could not resolve mlbid for "${player}"` }, { status: 404 });

    // Leaderboards we need (CSV)
    const root = 'https://baseballsavant.mlb.com/leaderboard';
    const minPA = 50; // keep small while testing

    const expectedStatsURL =
      `${root}/expected_statistics?type=batter&year=${season}&min=${minPA}&csv=true`;
    const plateDiscURL =
      `${root}/plate_discipline?year=${season}&player_type=batter&min=${minPA}&csv=true`;
    const battedBallURL =
      `${root}/batted_ball?year=${season}&player_type=batter&min=${minPA}&csv=true`;

    const [expRows, pdRows, bbRows] = await Promise.all([
      getCSV(expectedStatsURL),
      getCSV(plateDiscURL),
      getCSV(battedBallURL),
    ]);

    // Find row by player_id (preferred) or name fallback
    const byId = (row: Record<string, string>) =>
      row.player_id === id || row.mlbid === id || row.batter === id;
    const byName = (row: Record<string, string>) =>
      player ? (row.player_name?.toLowerCase().includes(player.toLowerCase())) : false;

    const exp = expRows.find(byId) ?? expRows.find(byName);
    const pd  = pdRows.find(byId)  ?? pdRows.find(byName);
    const bb  = bbRows.find(byId)  ?? bbRows.find(byName);

    // Map columns (column names can shift; use loose keys)
    const qoc = {
      avgEV:      toNum(exp?.avg_exit_velocity ?? exp?.average_ev ?? exp?.avg_ev),
      maxEV:      toNum(exp?.max_exit_velocity ?? exp?.max_ev),
      la:         toNum(exp?.average_launch_angle ?? exp?.avg_launch_angle ?? exp?.la),
      hardHitPct: toNum(exp?.hardhit_percent ?? exp?.hard_hit_percent),
      barrelsPct: toNum(exp?.barrel_batted_rate ?? exp?.barrel_percent ?? exp?.barrels_percent),
      xwOBA:      toNum(exp?.xwoba ?? exp?.expected_woba),
    };

    const discipline = {
      chasePct:       toNum(pd?.o_swing_percent ?? pd?.chase_percent ?? pd?.o_swing_pct),
      zoneContactPct: toNum(pd?.z_contact_percent ?? pd?.zone_contact_percent ?? pd?.z_contact_pct),
    };

    const batted = {
      pullPct:  toNum(bb?.pull_percent),
      centPct:  toNum(bb?.center_percent ?? bb?.cent_percent),
      oppoPct:  toNum(bb?.opposite_percent ?? bb?.oppo_percent),
      gbPct:    toNum(bb?.gb_percent),
      fbPct:    toNum(bb?.fb_percent),
      ldPct:    toNum(bb?.ld_percent),
    };

    return NextResponse.json({
      meta: { season, team: team ?? null, mlbid: id, player: player ?? null },
      qualityOfContact: qoc,
      approach: discipline,
      battedBall: batted,
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
