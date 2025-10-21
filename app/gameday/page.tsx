import { MockDataBanner } from '@/components/Badges';
import { GameDayClient } from './_client';

export default function GameDayPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Next Opponent</div>
        <h1 className="headline text-3xl">GameDay</h1>
        <MockDataBanner note="Schedule currently mocked; connector will replace this." />
      </div>
      <GameDayClient />
    </div>
  );
}
