export type OrgLevel = 'college' | 'pro';
export type Source = 'TruMedia' | 'Savant' | 'FanGraphs' | 'Sequence PDF';

export type PlayerId = {
  mlbam?: string;
  savant?: string;
  fangraphs?: string;
  ncaa?: string;
};
export type TeamId = { mlb?: string; ncaa?: string };

export type EntityKind = 'pitcher' | 'hitter';

export type MetricKey = string; // e.g., "xwOBA", "HH%", "RunValue_SL"
export type WindowKey = 'season' | 'last14' | 'last30' | 'career';

export interface MetricDef {
  key: MetricKey;
  label: string;
  entity: EntityKind | 'both';
  unit?: string;
  description: string;
  calc?: string;
  sourcePreference: Source[];
  freshnessSLA: 'post-game' | 'nightly' | 'weekly';
}

export interface Provenance {
  source: Source;
  fetchedAt: string; // ISO
  window?: WindowKey;
  notes?: string;
}
