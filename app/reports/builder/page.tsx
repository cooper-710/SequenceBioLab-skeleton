import { MockDataBanner } from '@/components/Badges';

export default function ReportsBuilder() {
  return (
    <div className="space-y-6">
      <div className="eyebrow">Reports</div>
      <h1 className="headline text-3xl">Custom Builder</h1>
      <MockDataBanner note="Drag-drop chapters; templates by role. Shell ready." />
      <div className="card p-5 h-64">Canvas (stub)</div>
    </div>
  );
}
