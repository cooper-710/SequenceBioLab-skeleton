import Link from "next/link";
import { FlaskConical, UserRound, BookOpen, Activity } from "lucide-react";

type TileProps = {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badges?: string[];
};

function Tile({ href, title, subtitle, icon, badges = [] }: TileProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white/80">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-white/60">{subtitle}</p>
        </div>
      </div>
      {badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70"
            >
              {b}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

export default function ScoutingLanding() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-white/50">
          College &amp; Pro · Hitters &amp; Pitchers
        </p>
        <h1 className="mt-2 text-3xl font-bold">Scouting</h1>
        <p className="mt-2 text-white/60">
          Choose a workflow to jump into player evaluation. Story gives a quick narrative view;
          Deep Dive opens the full toolset.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pitchers */}
        <div className="rounded-2xl border border-white/10 p-5">
          <div className="mb-4 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-white/70" />
            <h2 className="text-lg font-semibold">Pitchers</h2>
          </div>
          <div className="grid gap-4">
            <Tile
              href="/scouting/pitchers/story"
              title="Story Mode"
              subtitle="Movement bands, approach shape, command proxy."
              icon={<BookOpen className="h-5 w-5" />}
              badges={["Savant", "TruMedia"]}
            />
            <Tile
              href="/scouting/pitchers/deep-dive"
              title="Deep Dive"
              subtitle="Release cluster, approach angle, divergence, comps."
              icon={<Activity className="h-5 w-5" />}
              badges={["Savant", "FanGraphs"]}
            />
          </div>
        </div>

        {/* Hitters */}
        <div className="rounded-2xl border border-white/10 p-5">
          <div className="mb-4 flex items-center gap-2">
            <UserRound className="h-5 w-5 text-white/70" />
            <h2 className="text-lg font-semibold">Hitters</h2>
          </div>
          <div className="grid gap-4">
            <Tile
              href="/scouting/hitters/story"
              title="Story Mode"
              subtitle="Contact quality, swing decisions, zone control."
              icon={<BookOpen className="h-5 w-5" />}
              badges={["TruMedia", "Sequence PDF"]}
            />
            <Tile
              href="/scouting/hitters/deep-dive"
              title="Deep Dive"
              subtitle="Profiles, platoon splits, chase leverage."
              icon={<Activity className="h-5 w-5" />}
              badges={["FanGraphs"]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
