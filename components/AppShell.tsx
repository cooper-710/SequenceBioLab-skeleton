'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Users2,
  Search,
  FileBarChart2,
  Wrench,
  Package,
  Gauge,
  FlaskConical,
  Video,           // ← replace Camcorder with Video
  ChevronRight,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import clsx from 'clsx';
import { useAppState } from '@/lib/state';

const NAV = [
  { label: 'GameDay', href: '/gameday', icon: Gauge },
  {
    label: 'Scouting',
    href: '/scouting',
    icon: FileBarChart2,
    children: [
      { label: 'Pitchers — Story', href: '/scouting/pitchers/story' },
      { label: 'Pitchers — Deep Dive', href: '/scouting/pitchers/deep-dive' },
      { label: 'Hitters — Story', href: '/scouting/hitters/story' },
      { label: 'Hitters — Deep Dive', href: '/scouting/hitters/deep-dive' },
    ],
  },
  { label: '3D PitchVisualizer', href: '/pitchvisualizer', icon: FlaskConical },
  { label: 'Motion Capture', href: '/motion', icon: Video }, // ← here
  {
    label: 'Reports',
    href: '/reports',
    icon: Package,
    children: [
      { label: 'Generator', href: '/reports/generator' },
      { label: 'Custom Builder', href: '/reports/builder' },
    ],
  },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Compare', href: '/compare', icon: Users2 },
  { label: 'Admin', href: '/admin', icon: Wrench },
  { label: 'Settings', href: '/settings', icon: Building2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen grid grid-cols-[280px_1fr]">
      <aside className="hidden md:flex flex-col border-r border-border bg-surface">
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-accent" />
            <div className="font-semibold">Sequence BioLab</div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {NAV.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface2 transition',
                  path.startsWith(item.href) ? 'bg-surface2' : ''
                )}
              >
                {item.icon ? <item.icon className="h-4 w-4 text-muted" /> : null}
                <span className="text-sm font-medium">{item.label}</span>
                {item.children ? <ChevronRight className="ml-auto h-4 w-4 text-muted" /> : null}
              </Link>
              {item.children && (
                <div className="ml-8 mt-1 mb-2 space-y-1">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className={clsx(
                        'block text-[13px] px-3 py-1.5 rounded hover:bg-surface2',
                        path === c.href ? 'bg-surface2' : 'text-muted'
                      )}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-border flex items-center justify-between">
          <ThemeToggle />
          <div className="text-xs text-muted">v0.1 skeleton</div>
        </div>
      </aside>
      <main className="min-h-screen">
        <TopBar />
        <div className="max-w-7xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}

function TopBar() {
  const { teamKey, setTeamKey, options } = useAppState();
  return (
    <div className="h-16 border-b border-border bg-surface/70 backdrop-blur sticky top-0 z-40">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center gap-3">
        <div className="hidden md:block eyebrow">College & Pro · Hitters & Pitchers</div>
        <div className="ml-auto flex items-center gap-3">
          <select
            value={teamKey}
            onChange={(e) => setTeamKey(e.target.value)}
            className="h-9 rounded-md border border-border bg-surface2 text-sm px-2"
            aria-label="Select team/org"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button className="px-3 h-9 rounded-md bg-accent text-black font-medium hover:shadow">
            New Report
          </button>
        </div>
      </div>
    </div>
  );
}
