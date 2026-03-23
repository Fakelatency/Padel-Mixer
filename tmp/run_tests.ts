import {
    generateAmericanoRounds,
    generateTeamAmericanoRounds,
    generateMixedAmericanoRounds,
    generateAmericanoNextRound,
    generateTeamAmericanoNextRound,
    generateMixedAmericanoNextRound,
    generateMexicanoRound,
    generateTeamMexicanoRound,
    generateMixedMexicanoRound
} from '../src/lib/scheduler';
import { Player, Team, PlayerStats, Round } from '../src/lib/types';

// --- Test Data ---
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
    { id: 't1', name: 'Team 1 (H&A)', playerIds: ['p1', 'p2'] }, // Mixed
    { id: 't2', name: 'Team 2 (T&K)', playerIds: ['p3', 'p4'] }, // Mixed
    { id: 't3', name: 'Team 3 (M&O)', playerIds: ['p5', 'p6'] }, // Mixed
    { id: 't4', name: 'Team 4 (P&I)', playerIds: ['p7', 'p8'] }, // Mixed
];

const courts = 2;

// --- Helper Functions ---
function getPlayer(id: string) { return players.find(p => p.id === id)!; }
function getTeamName(teamIds: string[]) {
    if (teamIds.length === 2 && teamIds.includes('p1') && teamIds.includes('p2')) return 'Team 1 (H&A)';
    if (teamIds.length === 2 && teamIds.includes('p3') && teamIds.includes('p4')) return 'Team 2 (T&K)';
    if (teamIds.length === 2 && teamIds.includes('p5') && teamIds.includes('p6')) return 'Team 3 (M&O)';
    if (teamIds.length === 2 && teamIds.includes('p7') && teamIds.includes('p8')) return 'Team 4 (P&I)';
    return `[${teamIds.map(id => getPlayer(id).name).join(', ')}]`;
}

function printMatch(match: any) {
    const t1 = match.team1.playerIds;
    const t2 = match.team2.playerIds;
    const desc1 = t1.map((id: string) => `${getPlayer(id).name}(${getPlayer(id).gender.charAt(0)})`).join(' & ');
    const desc2 = t2.map((id: string) => `${getPlayer(id).name}(${getPlayer(id).gender.charAt(0)})`).join(' & ');
    console.log(`    Court ${match.court}: [ ${desc1} ]  vs  [ ${desc2} ]`);
}

function checkFixedTeam(match: any, formatName: string) {
    const isTeam1Fixed = teams.some(t => t.playerIds.every(id => match.team1.playerIds.includes(id)));
    const isTeam2Fixed = teams.some(t => t.playerIds.every(id => match.team2.playerIds.includes(id)));
    if (!isTeam1Fixed || !isTeam2Fixed) {
        console.error(`    ❌ FAIL [${formatName}]: Team was split! Match: ${getTeamName(match.team1.playerIds)} vs ${getTeamName(match.team2.playerIds)}`);
        return false;
    }
    return true;
}

function checkMixedGender(match: any, formatName: string) {
    let pass = true;
    for (const teamIds of [match.team1.playerIds, match.team2.playerIds]) {
        if (teamIds.length === 2) {
            const g1 = getPlayer(teamIds[0]).gender;
            const g2 = getPlayer(teamIds[1]).gender;
            if (g1 === g2) {
                console.error(`    ❌ FAIL [${formatName}]: Team has same gender! Team: ${getPlayer(teamIds[0]).name}(${g1}) & ${getPlayer(teamIds[1]).name}(${g2})`);
                pass = false;
            }
        }
    }
    return pass;
}

function runTest(testName: string, testFn: () => boolean) {
    console.log(`\n======================================================`);
    console.log(`🧪 TEST: ${testName}`);
    console.log(`======================================================`);
    try {
        const pass = testFn();
        if (pass) {
            console.log(`✅ RESULT: PASS`);
        } else {
            console.log(`❌ RESULT: FAIL`);
        }
    } catch (e: any) {
        console.error(`❌ RESULT: ERROR -> ${e.message}`);
    }
}

// ============================================================================
// TESTS
// ============================================================================

runTest('Americano (Classic) - Init Round', () => {
    let pass = true;
    const rounds = generateAmericanoRounds(players, courts);
    console.log(`  Generated ${rounds.length} rounds.`);
    rounds.forEach(r => {
        console.log(`  Round ${r.number}:`);
        r.matches.forEach(m => printMatch(m));
        if (r.sitting.length > 0) console.log(`    Sitting: ${r.sitting.map(id => getPlayer(id).name).join(', ')}`);
    });
    // Check everyone plays if courts are enough
    if (rounds[0].matches.length !== courts) pass = false;
    return pass;
});

runTest('Americano (Classic) - Next Round (Unlimited)', () => {
    const prevRounds = generateAmericanoRounds(players, courts).slice(0, 2);
    const round = generateAmericanoNextRound(players, prevRounds, courts);
    console.log(`  Extra Round:`);
    round.matches.forEach(m => printMatch(m));
    return round.matches.length === courts;
});

runTest('Americano Duet (Team Americano) - Next Round', () => {
    let pass = true;
    const prevRounds = generateTeamAmericanoRounds(teams, players, courts).slice(0, 2);
    const round = generateTeamAmericanoNextRound(teams, players, prevRounds, courts);
    console.log(`  Extra Round:`);
    round.matches.forEach(m => {
        printMatch(m);
        pass = pass && checkFixedTeam(m, 'Team Americano');
    });
    return pass;
});

runTest('Americano Mikst Rotating - Next Round', () => {
    let pass = true;
    const prevRounds = generateMixedAmericanoRounds(players, courts).slice(0, 2);
    const round = generateMixedAmericanoNextRound(players, prevRounds, courts);
    console.log(`  Extra Round:`);
    round.matches.forEach(m => {
        printMatch(m);
        pass = pass && checkMixedGender(m, 'Mixed Americano (Rotating)');
    });
    return pass;
});

runTest('Mexicano (Classic) - Standings Based', () => {
    let pass = true;
    // Create standings where p1 and p2 have highest points, they should play together 
    const standings: PlayerStats[] = players.map(p => ({
        playerId: p.id, matchesPlayed: 1, matchesWon: 1, pointDifference: 0,
        totalPoints: p.id === 'p1' ? 100 : p.id === 'p3' ? 90 : p.id === 'p2' ? 80 : p.id === 'p4' ? 70 : 10
    }));
    
    // In Mexicano, 1st & 3rd play 2nd & 4th. 
    // Sorted points: p1(100), p3(90), p2(80), p4(70)
    // Team 1: p1 & p2 (1st & 3rd)
    // Team 2: p3 & p4 (2nd & 4th)
    
    const round = generateMexicanoRound(players, standings, 2, courts, 'points', []);
    console.log(`  Generated Round 2:`);
    round.matches.forEach(m => printMatch(m));
    if (round.sitting.length > 0) console.log(`    Sitting: ${round.sitting.map(id => getPlayer(id).name).join(', ')}`);
    
    // Court 1: 1st(p1)+3rd(p2) vs 2nd(p3)+4th(p4)
    const court1 = round.matches.find(m => m.court === 1);
    if (court1) {
        const allIds = [...court1.team1.playerIds, ...court1.team2.playerIds];
        const hasP1P2Together = 
            (court1.team1.playerIds.includes('p1') && court1.team1.playerIds.includes('p2')) ||
            (court1.team2.playerIds.includes('p1') && court1.team2.playerIds.includes('p2'));
        if (!hasP1P2Together) {
            console.log(`    ❌ FAIL: Expected 1st & 3rd to be paired on Court 1!`);
            pass = false;
        }
    }
    return pass;
});

runTest('Mexicano Duet (Team Mexicano) - Standings Based', () => {
    let pass = true;
    const teamStandings = teams.map(t => ({
        teamId: t.id, totalPoints: t.id === 't1' ? 100 : t.id === 't2' ? 50 : 10
    }));
    
    const round = generateTeamMexicanoRound(teams, players, teamStandings, 2, courts, []);
    console.log(`  Generated Round 2:`);
    round.matches.forEach(m => {
        printMatch(m);
        pass = pass && checkFixedTeam(m, 'Team Mexicano');
    });
    
    // t1(1st) should play t2(2nd) on court 1
    const court1Match = round.matches[0];
    if (court1Match) {
       const hasT1 = court1Match.team1.playerIds.includes('p1') || court1Match.team2.playerIds.includes('p1');
       const hasT2 = court1Match.team1.playerIds.includes('p3') || court1Match.team2.playerIds.includes('p3');
       if (!hasT1 || !hasT2) {
           console.log(`    ❌ FAIL: Expected 1st team to play 2nd team!`);
           pass = false;
       }
    }
    
    return pass;
});

runTest('Mexicano Mikst Rotating - Standings Based', () => {
    let pass = true;
    
    // Males: p1, p3, p5, p7
    // Females: p2, p4, p6, p8
    
    // Make p1 best male, p2 best female
    const standings: PlayerStats[] = players.map(p => ({
        playerId: p.id, matchesPlayed: 1, matchesWon: 1, pointDifference: 0,
        totalPoints: p.id === 'p1' ? 100 : p.id === 'p2' ? 90 : 10
    }));
    
    const round = generateMixedMexicanoRound(players, teams, standings, [], 2, courts, 'rotating', []);
    console.log(`  Generated Round 2:`);
    round.matches.forEach(m => {
        printMatch(m);
        pass = pass && checkMixedGender(m, 'Mixed Mexicano (Rotating)');
    });
    
    // Best male (p1) should pair with best female (p2)
    const court1Match = round.matches[0];
    const isP1withP2 = (court1Match.team1.playerIds.includes('p1') && court1Match.team1.playerIds.includes('p2')) ||
                       (court1Match.team2.playerIds.includes('p1') && court1Match.team2.playerIds.includes('p2'));
                       
    if (!isP1withP2) {
        console.log(`    ❌ FAIL: Expected 1st Male to pair with 1st Female!`);
        pass = false;
    }
    
    return pass;
});

runTest('Mexicano Mikst Duet (Fixed) - Check both validators', () => {
    let pass = true;
    const teamStandings = teams.map(t => ({ teamId: t.id, totalPoints: 10 }));
    
    // Use the MixedMexicano generator but with 'fixed' mode
    const round = generateMixedMexicanoRound(players, teams, [], teamStandings, 2, courts, 'fixed', []);
    console.log(`  Generated Round 2:`);
    round.matches.forEach(m => {
        printMatch(m);
        pass = pass && checkFixedTeam(m, 'Mixed Mexicano (Fixed)');
        pass = pass && checkMixedGender(m, 'Mixed Mexicano (Fixed)');
    });
    return pass;
});

console.log('\n✅ All tests executed.');
