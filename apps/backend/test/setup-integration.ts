import { PrismaClient } from '@prisma/client';

const testDatabaseUrl =
  process.env.DATABASE_URL_TEST ??
  process.env.DATABASE_URL ??
  'postgresql://atrio:atrio@localhost:5432/atrio_test';

process.env.DATABASE_URL = testDatabaseUrl;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: testDatabaseUrl,
    },
  },
});

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up database before each test
  // Delete requests for test users first due to foreign key constraint
  const testUsers = await prisma.user.findMany({
    where: {
      username: {
        startsWith: 'testuser',
      },
    },
    select: { id: true },
  });

  if (testUsers.length > 0) {
    const userIds = testUsers.map((u) => u.id);
    await prisma.request.deleteMany({
      where: {
        requester_id: { in: userIds },
      },
    });
    await prisma.user.deleteMany({
      where: {
        id: { in: userIds },
      },
    });
  }
});

export { prisma };
