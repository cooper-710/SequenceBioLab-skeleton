import MocapEmbed from '@/components/MocapEmbed';

export default function MotionPage() {
  return (
    <div className="space-y-6">
      <header>
        <div className="eyebrow">Integrated Tool</div>
        <h1 className="headline text-3xl">Motion Capture</h1>
        <p className="text-sm text-muted">GitHub Pages embed with live URL params.</p>
      </header>
      <MocapEmbed />
    </div>
  );
}
