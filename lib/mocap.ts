// lib/mocap.ts
export type MocapParams = {
  mode?: 'player';
  player?: string;   // "First Last"
  session?: string;  // YYYY-MM-DD
  lock?: number;     // 0/1
};

export const MOCAP_BASE =
  process.env.NEXT_PUBLIC_MOCAP_BASE || 'https://cooper-710.github.io/motion-webapp/';

export function buildMocapUrl(params: MocapParams) {
  const url = new URL(MOCAP_BASE);
  const q = new URLSearchParams();
  q.set('mode', params.mode ?? 'player');
  if (params.player) q.set('player', params.player);
  if (params.session) q.set('session', params.session);
  if (typeof params.lock === 'number') q.set('lock', String(params.lock));
  url.search = q.toString();
  return url.toString();
}
