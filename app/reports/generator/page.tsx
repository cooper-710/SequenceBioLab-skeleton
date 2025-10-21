'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ReportType = 'Hitter — One Pager' | 'Pitcher — One Pager';

export default function ReportGenerator() {
  const router = useRouter();

  const [type, setType] = useState<ReportType>('Hitter — One Pager');
  const [team, setTeam] = useState('LAD');
  const [player, setPlayer] = useState('Tyler Glasnow');

  const handlePreview = () => {
    const q = new URLSearchParams({ type, team, player }).toString();
    router.push(`/reports/preview?${q}`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="headline text-2xl mb-6">Report Generator</h1>
      <p className="text-muted-foreground mb-8">
        Choose a template and player to generate a report. (We’ll hook up live data next.)
      </p>

      {/* Panel — dark-friendly surface */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Report Type */}
          <label className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Report Type</span>
            <select
              aria-label="Report Type"
              value={type}
              onChange={(e) => setType(e.target.value as ReportType)}
              className="h-10 w-full rounded-md px-3
                         bg-transparent dark:bg-white/5 text-foreground
                         placeholder:text-white/40
                         ring-1 ring-white/10 focus:ring-2 focus:ring-accent
                         outline-none transition"
            >
              <option>Hitter — One Pager</option>
              <option>Pitcher — One Pager</option>
            </select>
          </label>

          {/* Team */}
          <label className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Team Code</span>
            <input
              aria-label="Team Code"
              value={team}
              onChange={(e) => setTeam(e.target.value.toUpperCase())}
              placeholder="e.g., LAD"
              autoComplete="off"
              className="h-10 w-full rounded-md px-3
                         bg-transparent dark:bg-white/5 text-foreground
                         placeholder:text-white/40
                         ring-1 ring-white/10 focus:ring-2 focus:ring-accent
                         outline-none transition"
            />
          </label>

          {/* Player */}
          <label className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Player</span>
            <input
              aria-label="Player"
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              placeholder="First Last"
              autoComplete="off"
              className="h-10 w-full rounded-md px-3
                         bg-transparent dark:bg-white/5 text-foreground
                         placeholder:text-white/40
                         ring-1 ring-white/10 focus:ring-2 focus:ring-accent
                         outline-none transition"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePreview}
            className="h-10 px-4 rounded-md bg-accent text-black font-medium"
          >
            Preview
          </button>

          <button
            type="button"
            onClick={() => alert('Generate will export after we hook data + template.')}
            className="h-10 px-4 rounded-md ring-1 ring-white/15 hover:ring-white/30 transition"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
