// lib/mlb.ts
const MLB_BASE = 'https://statsapi.mlb.com/api/v1';

type Person = { id: number; fullName: string };

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z\s]/g, '')        // keep letters + spaces
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SequenceBioLab/1.0 (+sequencebiolab.com)' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

/**
 * Robust player-id lookup:
 * 1) Try /people?search=
 * 2) Fallback: /sports/1/players for current season (then previous), filter locally
 */
export async function lookupPlayerId(name: string): Promise<number | null> {
  const wanted = normalize(name);

  // 1) Try direct search
  try {
    const data = await fetchJSON<{ people?: Person[] }>(
      `${MLB_BASE}/people?search=${encodeURIComponent(name)}&sportId=1`
    );
    const list = data.people ?? [];
    const exact = list.find((p) => normalize(p.fullName) === wanted);
    if (exact) return exact.id;
    const loose = list.find((p) => normalize(p.fullName).includes(wanted));
    if (loose) return loose.id;
  } catch {
    // ignore and fall through
  }

  // 2) Fallback: season dump and filter
  const season = new Date().getFullYear();
  for (const yr of [season, season - 1]) {
    try {
      const data = await fetchJSON<{ people?: Person[] }>(
        `${MLB_BASE}/sports/1/players?season=${yr}&gameType=R`
      );
      const list = data.people ?? [];
      const exact = list.find((p) => normalize(p.fullName) === wanted);
      if (exact) return exact.id;
      const loose = list.find((p) => normalize(p.fullName).includes(wanted));
      if (loose) return loose.id;
    } catch {
      // try next year in the loop
    }
  }

  return null;
}
