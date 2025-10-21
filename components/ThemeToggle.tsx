'use client';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark'); else root.classList.remove('dark');
  }, [dark]);
  return (
    <button onClick={() => setDark(!dark)} className="px-3 h-9 rounded-md border border-border bg-surface2 text-sm">
      {dark ? 'Dark' : 'Light'}
    </button>
  );
}
