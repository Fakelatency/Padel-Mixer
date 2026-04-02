import { generateTeamAmericanoRounds, generateAmericanoNextRound, generateTeamAmericanoNextRound } from '../src/lib/scheduler';
import { Player, Team } from '../src/lib/types';

const players: Player[] = [
    { id: 'p1', name: 'Hubert', gender: 'male' },
    { id: 'p2', name: 'Ania', gender: 'female' },
    { id: 'p3', name: 'Tomek', gender: 'male' },
    { id: 'p4', name: 'Kasia', gender: 'female' },
];

const teams: Team[] = [
    { id: 't1', name: 'Hubert & Ania', playerIds: ['p1', 'p2'] },
    { id: 't2', name: 'Tomek & Kasia', playerIds: ['p3', 'p4'] },
];

const courts = 1;

console.log('--- Round 1 (Team Americano) ---');
const rounds = generateTeamAmericanoRounds(teams, players, courts);
rounds[0].matches.forEach(m => {
    console.log(`Match: [${m.team1.playerIds.join(', ')}] vs [${m.team2.playerIds.join(', ')}]`);
});

console.log('\n--- Extra Round (using generateTeamAmericanoNextRound) ---');
const nextRound = generateTeamAmericanoNextRound(teams, players, rounds, courts);
nextRound.matches.forEach(m => {
    console.log(`Match: [${m.team1.playerIds.join(', ')}] vs [${m.team2.playerIds.join(', ')}]`);
});

// Check if Hubert (p1) is still with Ania (p2)
const hubertMatchFixed = nextRound.matches.find(m => m.team1.playerIds.includes('p1') || m.team2.playerIds.includes('p1'));
if (hubertMatchFixed) {
    const hubertTeam = hubertMatchFixed.team1.playerIds.includes('p1') ? hubertMatchFixed.team1 : hubertMatchFixed.team2;
    if (!hubertTeam.playerIds.includes('p2')) {
        console.log('\nBUG STILL PRESENT: Hubert is NOT with Ania in the extra round!');
        console.log(`Hubert's partner is: ${hubertTeam.playerIds.find(id => id !== 'p1')}`);
    } else {
        console.log('\nSUCCESS: Hubert is still with Ania with the new generator!');
    }
}
