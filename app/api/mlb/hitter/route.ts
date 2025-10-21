// app/api/mlb/hitter/route.ts
// Real MLB data (no keys). Accepts ?playerId=##### OR ?player=First Last.
// Optional: ?season=YYYY (defaults to current year)

import { NextRequest, NextResponse } from 'next/server';
import { lookupPlayerId } from '@/lib/mlb';

export const dynamic = 'force-dynamic';

type PeopleResponse = {
  people?: Array<{
    id: number;
    fullName: string;
    currentTeam?: { id?: number; name?: string; abbreviation?: string };
    primaryNumber?: string;
    primaryPosition?: { abbreviation?: string };
    batSide?: { code?: string; description?: string };
    height?: string;
    weight?: number | string;
    currentAge?: number;
    stats?: Array<{ splits?: Array<{ stat?: Record<string, any> }> }>;
  }>;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const playerName = searchParams.get('player')?.trim() || undefined;
  const playerIdParam = searchParams.get('playerId')?.trim() || undefined;
  const season = searchParams.get('season') ?? String(new Date().getFullYear());

  try {
    // 1) Resolve the player ID
    let id: number | null = null;
    if (playerIdParam && /^\d+$/.test(playerIdParam)) {
      id = Number(playerIdParam);
    } else if (playerName) {
      id = await lookupPlayerId(playerName);
    }

    if (!id) {
      return NextResponse.json(
        { error: 'No playerId or resolvable player name provided' },
        { status: 404 }
      );
    }

    // 2) Fetch bio + season hitting stats
    const detailRes = await fetch(
      `https://statsapi.mlb.com/api/v1/people/${id}` +
        `?hydrate=stats(group=[hitting],type=[season],season=${encodeURIComponent(season)})`,
      { cache: 'no-store' }
    );
    if (!detailRes.ok) {
      return NextResponse.json(
        { error: `MLB API error: ${detailRes.status} ${detailRes.statusText}` },
        { status: 502 }
      );
    }
    const detailJson = (await detailRes.json()) as PeopleResponse;
    const p = Array.isArray(detailJson?.people) ? detailJson.people[0] : null;
    if (!p) {
      return NextResponse.json({ error: 'No detail response for player' }, { status: 502 });
    }

    const split = p?.stats?.[0]?.splits?.[0] ?? null;
    const s = split?.stat ?? {};

    // Safe numbers
    const PA = Number(s.plateAppearances ?? 0);
    const SO = Number(s.strikeOuts ?? 0);
    const BB = Number(s.baseOnBalls ?? 0);

    const kPct = PA ? (SO / PA) * 100 : 0;
    const bbPct = PA ? (BB / PA) * 100 : 0;

    // 3) Normalized payload you can map into your report UI
    const payload = {
      source: 'mlb-statsapi',
      season,
      playerId: id,
      meta: {
        player: p.fullName ?? playerName ?? null,
        team:
          (p.currentTeam as any)?.abbreviation ??
          (p.currentTeam as any)?.name ??
          null,
        position: p.primaryPosition?.abbreviation ?? null,
      },
      overview: {
        bats: p.batSide?.code ?? p.batSide?.description ?? null,
        height: p.height ?? null, // e.g., 6'2"
        weight: p.weight ? Number(p.weight) : null,
        age: p.currentAge ?? null,
      },
      rates: {
        avg: s.avg ? Number(s.avg) : null,
        obp: s.obp ? Number(s.obp) : null,
        slg: s.slg ? Number(s.slg) : null,
        ops: s.ops ? Number(s.ops) : null,
      },
      approach: {
        plateAppearances: PA,
        kPct,
        bbPct,
        strikeOuts: SO,
        walks: BB,
      },
      raw: { split }, // keep raw for future mapping
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
