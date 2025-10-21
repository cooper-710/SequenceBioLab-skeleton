// app/api/mlb/player-id/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { lookupPlayerId } from '@/lib/mlb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const player = searchParams.get('player')?.trim();

  if (!player) {
    return NextResponse.json(
      { error: 'Missing player query string ?player=' },
      { status: 400 }
    );
  }

  try {
    const id = await lookupPlayerId(player);
    if (id) return NextResponse.json({ id, player });
    return NextResponse.json(
      { error: `No player found for "${player}"` },
      { status: 404 }
    );
  } catch (err) {
    console.error('lookupPlayerId error', err);
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }
}
