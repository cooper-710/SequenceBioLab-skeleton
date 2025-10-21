import { MockDataBanner } from '@/components/Badges';

export default function ComparePage() {
  return (
    <div className="space-y-6">
      <div className="eyebrow">Analysis</div>
      <h1 className="headline text-3xl">Compare</h1>
      <MockDataBanner note="Side-by-side and delta modes across Story/Deep Dive. Shell ready." />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5 h-64">Left entity (stub)</div>
        <div className="card p-5 h-64">Right entity (stub)</div>
      </div>
    </div>
  );
}
