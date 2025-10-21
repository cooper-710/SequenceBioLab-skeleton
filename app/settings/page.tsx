export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="eyebrow">Account</div>
      <h1 className="headline text-3xl">Settings</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold mb-2">Appearance</h3>
          <p className="text-sm text-muted">Theme, density, typography.</p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-2">Notifications</h3>
          <p className="text-sm text-muted">Pre‑game pack alerts, data freshness, opponent updates.</p>
        </div>
      </div>
    </div>
  );
}
