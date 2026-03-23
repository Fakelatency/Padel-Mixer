import { 
    generateTeamAmericanoNextRound, 
    generateMixedAmericanoNextRound, 
    generateMixedMexicanoRound,
    generateMexicanoRound,
    generateTeamMexicanoRound
} from '../src/lib/scheduler';
import { Player, Team, PlayerStats } from '../src/lib/types';

const players: Player[] = [
    { id: 'p1', name: 'Hubert', gender: 'male' },
    { id: 'p2', name: 'Ania', gender: 'female' },
    { id: 'p3', name: 'Tomek', gender: 'male' },
    { id: 'p4', name: 'Kasia', gender: 'female' },
    { id: 'p5', name: 'Marek', gender: 'male' },
    { id: 'p6', name: 'Ola', gender: 'female' },
    { id: 'p7', name: 'Piotr', gender: 'male' },
    { id: 'p8', name: 'Iga', gender: 'female' },
];

const teams: Team[] = [
    { id: 't1', name: 'Team 1', playerIds: ['p1', 'p2'] },
    { id: 't2', name: 'Team 2', playerIds: ['p3', 'p4'] },
    { id: 't3', name: 'Team 3', playerIds: ['p5', 'p6'] },
    { id: 't4', name: 'Team 4', playerIds: ['p7', 'p8'] },
];

const standings: PlayerStats[] = players.map(p => ({
    playerId: p.id,
    playerName: p.name,
    matchesPlayed: 1,
    matchesWon: 0,
    matchesLost: 1,
    totalPoints: Math.floor(Math.random() * 20),
    pointDifference: 0,
    sitOuts: 0,
    partners: []
}));

const teamStandings = teams.map(t => ({
    teamId: t.id,
    totalPoints: Math.floor(Math.random() * 40),
    pointDifference: 0,
    matchesWon: 0
}));

console.log('--- Testing Mixed Americano (Rotating) ---');
const mixedRound = generateMixedAmericanoNextRound(players, [], 2);
mixedRound.matches.forEach(m => {
    const p1 = players.find(p => p.id === m.team1.playerIds[0])!;
    const p2 = players.find(p => p.id === m.team1.playerIds[1])!;
    console.log(`Match: [${p1.name}(${p1.gender}), ${p2.name}(${p2.gender})] vs ...`);
    if (p1.gender === p2.gender) {
        console.log('FAIL: Same gender in team!');
    } else {
        console.log('SUCCESS: Mixed genders in team.');
    }
});

console.log('\n--- Testing Mixed Mexicano (Rotating) ---');
const mixedMexRound = generateMixedMexicanoRound(players, teams, standings, teamStandings, 2, 2, 'rotating', []);
mixedMexRound.matches.forEach(m => {
    const p1 = players.find(p => p.id === m.team1.playerIds[0])!;
    const p2 = players.find(p => p.id === m.team1.playerIds[1])!;
    console.log(`Match: [${p1.name}(${p1.gender}), ${p2.name}(${p2.gender})] vs ...`);
    if (p1.gender === p2.gender) {
        console.log('FAIL: Same gender in team!');
    } else {
        console.log('SUCCESS: Mixed genders in team.');
    }
});

console.log('\n--- Testing Team Americano (Duet) ---');
const teamRound = generateTeamAmericanoNextRound(teams, players, [], 2);
teamRound.matches.forEach(m => {
    const isT1 = teams.some(t => t.playerIds.every(id => m.team1.playerIds.includes(id)));
    console.log(`Team 1 valid: ${isT1}`);
    if (!isT1) console.log('FAIL: Team split!');
});
console.log('SUCCESS: Teams preserved.');
