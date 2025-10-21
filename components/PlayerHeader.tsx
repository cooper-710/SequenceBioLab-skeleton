// components/PlayerHeader.tsx
import Link from 'next/link';
import type { Player } from '@/lib/entities';

export function PlayerHeader({ p }: { p: Player }) {
  const base = p.kind === 'pitcher' ? '/scouting/pitchers' : '/scouting/hitters';
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="eyebrow">{p.level === 'pro' ? 'Pro' : 'College'} · {p.teamLabel}</div>
        <h1 className="headline text-3xl">{p.name}</h1>
        <div className="mt-1 text-sm text-muted">
          {p.kind === 'pitcher' ? `Throws: ${p.throws ?? '—'}` : `Bats: ${p.bats ?? '—'}`}
        </div>
      </div>
      <div className="flex gap-2">
        <Link href={`${base}/${p.id}/story`} className="px-3 h-9 rounded-md border border-border bg-surface2 text-sm flex items-center">
          Story
        </Link>
        <Link href={`${base}/${p.id}/deep-dive`} className="px-3 h-9 rounded-md bg-accent text-black text-sm font-medium flex items-center">
          Deep Dive
        </Link>
      </div>
    </div>
  );
}
