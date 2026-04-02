import { generateShareableUrl, parseShareableData } from '../src/lib/share';
import { Tournament } from '../src/lib/types';

const mockTournament: any = {
  id: 't1',
  name: 'Test Tournament Name Here',
  format: 'americano',
  scoringSystem: 24,
  players: [{ id: 'p1', name: 'Alice' }, { id: 'p2', name: 'Bob' }],
  teams: [],
  courts: 1,
  rounds: [
    {
      id: 'r1',
      number: 1,
      matches: [
        {
          id: 'm1',
          round: 1,
          court: 1,
          team1: { playerIds: ['p1'] },
          team2: { playerIds: ['p2'] },
          score1: 24,
          score2: 0,
          status: 'completed',
        }
      ],
      completed: true,
      sitting: []
    }
  ],
  currentRound: 1,
  roundMode: 'fixed',
  status: 'finished',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  totalRounds: null,
  rankingStrategy: 'points'
};

const url = generateShareableUrl(mockTournament);
console.log('Short URL length:', url.length);
console.log('Is v2?', url.includes('v2:'));

const parsed = parseShareableData(url.split('data=')[1]);
if (parsed) {
  console.log('Successfully parsed compressed URL. Name:', parsed.name);
} else {
  console.error('Failed to parse newly generated compressed URL');
}

// Test legacy
const legacyShareData = {
    n: mockTournament.name,
    f: mockTournament.format,
    s: mockTournament.scoringSystem,
    p: mockTournament.players.map((p: any) => ({ i: p.id, n: p.name })),
    t: mockTournament.teams.map((t: any) => ({ i: t.id, n: t.name, p: t.playerIds })),
    r: mockTournament.rounds.map((round: any) => ({
        n: round.number,
        m: round.matches.map((match: any) => ({
            c: match.court,
            t1: match.team1.playerIds,
            t2: match.team2.playerIds,
            s1: match.score1,
            s2: match.score2,
        })),
    })),
    d: mockTournament.createdAt,
};
const legacyJsonStr = JSON.stringify(legacyShareData);
const legacyEncoded = btoa(unescape(encodeURIComponent(legacyJsonStr)));

const legacyParsed = parseShareableData(legacyEncoded);
if (legacyParsed && legacyParsed.name === mockTournament.name) {
  console.log('Successfully parsed legacy base64 URL');
} else {
  console.error('Failed to parse legacy base64 URL');
}
