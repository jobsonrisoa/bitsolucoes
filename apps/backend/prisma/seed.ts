import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('[INFO] Starting database seed...');

  // Hash passwords
  const passwordHash = await bcrypt.hash('demo123', 10);

  // Create users
  const ana = await prisma.user.upsert({
    where: { username: 'ana' },
    update: {},
    create: {
      username: 'ana',
      name: 'Ana Silva',
      password_hash: passwordHash,
    },
  });

  const carlos = await prisma.user.upsert({
    where: { username: 'carlos' },
    update: {},
    create: {
      username: 'carlos',
      name: 'Carlos Souza',
      password_hash: passwordHash,
    },
  });

  console.log('[OK] Users created/updated:', { ana: ana.username, carlos: carlos.username });

  // Create sample requests (only if they don't exist)
  const existingRequests = await prisma.request.findMany({
    where: { requester_id: carlos.id },
    take: 4,
  });

  if (existingRequests.length === 0) {
    const sampleRequests = [
      {
        title: 'Acesso ao VPN',
        description: 'Solicito acesso ao VPN corporativo',
        category: 'TI',
        status: 'OPEN',
        requester_id: carlos.id,
      },
      {
        title: 'Novo monitor',
        description: 'Monitor atual está com defeito',
        category: 'INFRAESTRUTURA',
        status: 'IN_PROGRESS',
        requester_id: carlos.id,
      },
      {
        title: 'Licença do pacote Office',
        description: 'Necessito renovar a licença',
        category: 'COMPRAS',
        status: 'DONE',
        requester_id: carlos.id,
      },
      {
        title: 'Cadeira ergonômica',
        description: 'Solicitação de nova cadeira ergonômica',
        category: 'RH',
        status: 'OPEN',
        requester_id: carlos.id,
      },
    ];

    for (const req of sampleRequests) {
      await prisma.request.create({ data: req });
    }
  }

  // Create additional requests for testing
  for (let i = 5; i <= 20; i++) {
    await prisma.request.create({
      data: {
        title: `Solicitação de TI #${i}`,
        description: `Descrição detalhada para a solicitação de TI número ${i}`,
        category: 'TI',
        status: i % 3 === 0 ? 'OPEN' : i % 3 === 1 ? 'IN_PROGRESS' : 'DONE',
        requester_id: carlos.id,
      },
    });
  }

  const requestCount = await prisma.request.count();
  console.log(`[OK] Created ${requestCount} sample requests`);

  console.log('[SUCCESS] Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('[ERROR] Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
