'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Opt = { label: string; value: string };
type AppState = { teamKey: string; setTeamKey: (k: string) => void; options: Opt[] };

const Ctx = createContext<AppState | null>(null);

const DEFAULT = 'college:wright-state';
const OPTIONS: Opt[] = [
  { label: 'Wright State (College)', value: 'college:wright-state' },
  { label: 'NY Mets (Pro)', value: 'pro:ny-mets' },
];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [teamKey, setTeamKey] = useState<string>(DEFAULT);

  useEffect(() => {
    const k = window.localStorage.getItem('sbl.teamKey');
    if (k) setTeamKey(k);
  }, []);
  useEffect(() => {
    window.localStorage.setItem('sbl.teamKey', teamKey);
  }, [teamKey]);

  const value = useMemo(() => ({ teamKey, setTeamKey, options: OPTIONS }), [teamKey]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const v = useContext(Ctx);
  if (!v) throw new Error('AppStateProvider missing');
  return v;
}
