import { MockDataBanner } from '@/components/Badges';
import { SearchClient } from './_client';

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div className="eyebrow">Global</div>
      <h1 className="headline text-3xl">Search</h1>
      <MockDataBanner note="Index is mocked. Selecting a player uses dynamic routes." />
      <SearchClient />
    </div>
  );
}
