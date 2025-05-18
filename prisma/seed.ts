import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding demo subjects, decks, and cards …\n');

    // --- Create or find user ---
    let user = await prisma.user.findFirst();

    if (!user) {
        const plainPassword = 'password123';
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        user = await prisma.user.create({
            data: {
                name: 'Demo User',
                email: 'user@example.com',
                password: hashedPassword,
            },
        });

        console.log(`Created default user: ${user.email}`);
    } else {
        console.log(`Using existing user: ${user.email}`);
    }

    // --- Prepare subjects data ---
    const subjectsData = Array.from({ length: 10 }, () => ({
        name: faker.word.words(2),
        description: faker.lorem.sentence(),
        ownerId: user!.id,
    }));

    await prisma.subject.createMany({
        data: subjectsData,
        skipDuplicates: true,
    });

    // Since createMany does not return created records, refetch subjects:
    const subjects = await prisma.subject.findMany({
        where: { ownerId: user!.id },
    });

    // --- Prepare decks data ---
    const decksData = subjects.flatMap((subject) =>
        Array.from({ length: 10 }, () => ({
            name: faker.word.words(3),
            description: faker.lorem.sentence(),
            ownerId: user!.id,
            subjectId: subject.id,
        })),
    );

    await prisma.deck.createMany({
        data: decksData,
        skipDuplicates: true,
    });

    // Refetch decks to get their IDs
    const decks = await prisma.deck.findMany({
        where: { ownerId: user!.id },
    });

    // --- Prepare cards data ---
    const cardsData = decks.flatMap((deck) => {
        const randomLength = Math.floor(Math.random() * (25 - 5 + 1)) + 5; // random between 5 and 25
        return Array.from({ length: randomLength }, () => ({
          question: faker.lorem.sentence(),
          answer: faker.lorem.sentences(3),
          ownerId: user!.id,
          deckId: deck.id,
          imgUrl: null,
        }));
      });
    await prisma.card.createMany({
        data: cardsData,
        skipDuplicates: true,
    });

    console.log('\nSeeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
