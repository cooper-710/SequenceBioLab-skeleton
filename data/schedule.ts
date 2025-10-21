import type { OrgLevel } from '@/lib/types';

type NextOpponent = {
  teamName: string;
  opponentName: string;
  gameTimeLocal: string; // ISO
  probablePitchers?: { home?: string; away?: string };
  level: OrgLevel;
};

const MOCK_SCHEDULE: Record<string, NextOpponent> = {
  'college:wright-state': {
    teamName: 'Wright State Raiders',
    opponentName: 'Dayton Flyers',
    gameTimeLocal: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    probablePitchers: { home: 'TBD', away: 'TBD' },
    level: 'college',
  },
  'pro:ny-mets': {
    teamName: 'New York Mets',
    opponentName: 'Atlanta Braves',
    gameTimeLocal: new Date(Date.now() + 30 * 3600 * 1000).toISOString(),
    probablePitchers: { home: 'Megill', away: 'Fried' },
    level: 'pro',
  },
};

export async function getNextOpponent(key: string): Promise<NextOpponent | null> {
  await new Promise((r) => setTimeout(r, 120)); // simulate I/O
  return MOCK_SCHEDULE[key] ?? null;
}
