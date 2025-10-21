'use client';
import Link from 'next/link';
import { useAppState } from '@/lib/state';
import { listPlayers } from '@/lib/entities';

export function SearchClient() {
  const { teamKey } = useAppState();
  const players = listPlayers(teamKey);

  return (
    <div className="space-y-4">
      <div className="eyebrow">Team</div>
      <div className="text-sm text-muted">Showing players for <span className="text-text font-medium">{teamKey}</span></div>

      <div className="grid md:grid-cols-2 gap-3">
        {players.map(p => {
          const base = p.kind === 'pitcher' ? '/scouting/pitchers' : '/scouting/hitters';
          return (
            <div key={p.id} className="card p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name} <span className="text-muted">· {p.kind}</span></div>
                <div className="text-sm text-muted">{p.teamLabel}</div>
              </div>
              <div className="flex gap-2">
                <Link href={`${base}/${p.id}/story`} className="px-3 h-9 rounded-md border border-border bg-surface2 text-sm flex items-center">Story</Link>
                <Link href={`${base}/${p.id}/deep-dive`} className="px-3 h-9 rounded-md bg-accent text-black text-sm font-medium flex items-center">Deep Dive</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
