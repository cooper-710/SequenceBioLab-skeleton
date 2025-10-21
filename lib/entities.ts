// lib/entities.ts
export type Hand = 'R' | 'L' | 'S';
export type PlayerKind = 'pitcher' | 'hitter';

export interface Player {
  id: string;              // global slug: e.g. "pro:ny-mets:pete-alonso"
  teamKey: string;         // e.g. "pro:ny-mets"
  name: string;
  kind: PlayerKind;
  throws?: Hand;
  bats?: Hand;
  level: 'college' | 'pro';
  teamLabel: string;       // display name
}

const PLAYERS: Player[] = [
  // PRO — NY Mets
  { id:'pro:ny-mets:tylor-megill', teamKey:'pro:ny-mets', name:'Tylor Megill', kind:'pitcher', throws:'R', level:'pro', teamLabel:'New York Mets' },
  { id:'pro:ny-mets:pete-alonso', teamKey:'pro:ny-mets', name:'Pete Alonso', kind:'hitter', bats:'R', level:'pro', teamLabel:'New York Mets' },
  // COLLEGE — Wright State (sample names)
  { id:'college:wright-state:raider-pitcher-a', teamKey:'college:wright-state', name:'Raider Pitcher A', kind:'pitcher', throws:'R', level:'college', teamLabel:'Wright State Raiders' },
  { id:'college:wright-state:raider-hitter-a', teamKey:'college:wright-state', name:'Raider Hitter A', kind:'hitter', bats:'R', level:'college', teamLabel:'Wright State Raiders' },
];

export function listPlayers(teamKey: string): Player[] {
  return PLAYERS.filter(p => p.teamKey === teamKey);
}

export function getPlayerById(id: string): Player | undefined {
  return PLAYERS.find(p => p.id === id);
}
