import Link from "next/link";
import { FileBarChart2, Wrench, Bookmark } from "lucide-react";

function Tile({
  href,
  title,
  subtitle,
  icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
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
    </Link>
  );
}

export default function ReportsLanding() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-white/50">Reports</p>
        <h1 className="mt-2 text-3xl font-bold">Generator &amp; Builder</h1>
        <p className="mt-2 text-white/60">
          Generate polished scouting reports, or build custom layouts from your data sources.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Tile
          href="/reports/generator"
          title="Generator"
          subtitle="Prebuilt report templates for pitchers and hitters."
          icon={<FileBarChart2 className="h-5 w-5" />}
        />
        <Tile
          href="/reports/custom-builder"
          title="Custom Builder"
          subtitle="Drag-and-drop sections to design your own reports."
          icon={<Wrench className="h-5 w-5" />}
        />
        <Tile
          href="/reports/saved"
          title="Saved Reports"
          subtitle="Reopen or export reports you generated earlier."
          icon={<Bookmark className="h-5 w-5" />}
        />
      </div>
    </main>
  );
}
