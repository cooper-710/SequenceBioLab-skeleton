import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { AppShell } from '@/components/AppShell';
import { AppStateProvider } from '@/lib/state';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sequence BioLab',
  description:
    'Elite scouting, 3D pitch visualization, and motion capture for college & pro — hitters & pitchers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="dark" lang="en">
      <body className={`${inter.className} bg-bg text-text`}>
        <AppStateProvider>
          <AppShell>{children}</AppShell>
        </AppStateProvider>
      </body>
    </html>
  );
}
