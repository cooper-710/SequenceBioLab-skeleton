import { MockDataBanner } from '@/components/Badges';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="eyebrow">Admin</div>
      <h1 className="headline text-3xl">Org & Licensing</h1>
      <MockDataBanner note="Users, roles, licensing gates, data refresh console (stubs)." />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5 h-48">Users & Roles (stub)</div>
        <div className="card p-5 h-48">Vendor Licenses (stub)</div>
      </div>
    </div>
  );
}
