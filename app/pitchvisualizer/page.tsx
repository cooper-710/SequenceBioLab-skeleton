import PVEmbed from '@/components/PVEmbed';

export default function PitchVisualizerPage() {
  return (
    <div className="space-y-6">
      <header>
        <div className="eyebrow">Integrated Tool</div>
        <h1 className="headline text-3xl">3D PitchVisualizer</h1>
        <p className="text-sm text-muted">GitHub Pages embed with live URL params.</p>
      </header>
      <PVEmbed />
    </div>
  );
}
