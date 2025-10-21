import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="headline text-3xl">Welcome to Sequence BioLab</h1>
      <p className="text-muted">Elite scouting and performance platform for college & pro — hitters & pitchers.</p>
      <Link href="/gameday" className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-accent text-black font-medium hover:shadow">Enter GameDay</Link>
    </div>
  );
}
