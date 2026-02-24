// Seed test users by calling the auth signup endpoint
// Run: node prisma/seed-users.mjs

const BASE_URL = process.env.BASE_URL || 'http://localhost:3132/padel';

const TEST_USERS = [
    { name: 'Jacek Brończyk', email: 'jacek@test.pl', password: 'test1234' },
    { name: 'Hubert Brończyk', email: 'hubert@test.pl', password: 'test1234' },
    { name: 'Krzysztof Brończyk', email: 'krzysztof@test.pl', password: 'test1234' },
    { name: 'Adam Kowalski', email: 'adam@test.pl', password: 'test1234' },
];

async function seed() {
    for (const user of TEST_USERS) {
        try {
            const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`✓ Created: ${user.name} (${user.email})`);
            } else {
                console.log(`⚠ ${user.name}: ${data.message || JSON.stringify(data)}`);
            }
        } catch (err) {
            console.error(`✗ ${user.name}: ${err.message}`);
        }
    }
}

seed();
