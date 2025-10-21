// lib/pv.ts
export type PVParams = {
  team: string;
  pitcher: string; // "Last, First"
  view?: string;   // e.g., "catcher"
  trail?: number;  // 0/1
  orbit?: number;  // 0/1
};

export const PV_BASE =
  process.env.NEXT_PUBLIC_PV_BASE || 'https://cooper-710.github.io/NEWPV-main_with_orbit/';

export function buildPVUrl(params: PVParams) {
  const url = new URL(PV_BASE);
  const q = new URLSearchParams();
  q.set('team', params.team);
  q.set('pitcher', params.pitcher);
  if (params.view) q.set('view', params.view);
  if (typeof params.trail === 'number') q.set('trail', String(params.trail));
  if (typeof params.orbit === 'number') q.set('orbit', String(params.orbit));
  url.search = q.toString();
  return url.toString();
}

// naive "First Last" -> "Last, First"
export function toLastFirst(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  const last = parts.pop();
  return `${last}, ${parts.join(' ')}`;
}
