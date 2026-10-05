import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { prisma } from '../setup-integration';

describe('Dashboard (integration)', () => {
  let userId: number;
  let testUsername: string;

  beforeEach(async () => {
    // Generate unique username for each test
    testUsername = `testuser-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create a test user
    const passwordHash = await bcrypt.hash('test123', 10);
    const user = await prisma.user.create({
      data: {
        username: testUsername,
        name: 'Test User',
        password_hash: passwordHash,
      },
    });
    userId = user.id;
  });

  afterEach(async () => {
    // Clean up
    await prisma.request.deleteMany({
      where: {
        requester_id: userId,
      },
    });
    await prisma.user.deleteMany({
      where: {
        id: userId,
      },
    });
  });

  it('should calculate correct dashboard summary', async () => {
    // Create requests with different statuses
    await prisma.request.createMany({
      data: [
        {
          title: 'Open Request 1',
          description: 'Open',
          category: 'TI',
          status: 'OPEN',
          requester_id: userId,
        },
        {
          title: 'Open Request 2',
          description: 'Open',
          category: 'RH',
          status: 'OPEN',
          requester_id: userId,
        },
        {
          title: 'In Progress Request 1',
          description: 'In Progress',
          category: 'TI',
          status: 'IN_PROGRESS',
          requester_id: userId,
        },
        {
          title: 'Done Request 1',
          description: 'Done',
          category: 'COMPRAS',
          status: 'DONE',
          requester_id: userId,
        },
        {
          title: 'Done Request 2',
          description: 'Done',
          category: 'FINANCEIRO',
          status: 'DONE',
          requester_id: userId,
        },
      ],
    });

    // Calculate summary manually
    const allRequests = await prisma.request.findMany();
    const total = allRequests.length;
    const open = allRequests.filter((r) => r.status === 'OPEN').length;
    const inProgress = allRequests.filter((r) => r.status === 'IN_PROGRESS').length;
    const done = allRequests.filter((r) => r.status === 'DONE').length;

    expect(total).toBe(5);
    expect(open).toBe(2);
    expect(inProgress).toBe(1);
    expect(done).toBe(2);
    expect(open + inProgress + done).toBe(total);
  });

  it('should update summary after creating a request', async () => {
    // Initial state
    await prisma.request.createMany({
      data: [
        {
          title: 'Existing Request',
          description: 'Existing',
          category: 'TI',
          status: 'OPEN',
          requester_id: userId,
        },
      ],
    });

    let allRequests = await prisma.request.findMany();
    const initialTotal = allRequests.length;

    // Create new request
    await prisma.request.create({
      data: {
        title: 'New Request',
        description: 'New',
        category: 'TI',
        status: 'OPEN',
        requester_id: userId,
      },
    });

    // Verify update
    allRequests = await prisma.request.findMany();
    expect(allRequests.length).toBe(initialTotal + 1);
  });

  it('should update summary after status change', async () => {
    // Create request
    const request = await prisma.request.create({
      data: {
        title: 'Status Change Test',
        description: 'Testing status change',
        category: 'TI',
        status: 'OPEN',
        requester_id: userId,
      },
    });

    // Initial state
    let allRequests = await prisma.request.findMany();
    const initialOpen = allRequests.filter((r) => r.status === 'OPEN').length;
    const initialInProgress = allRequests.filter((r) => r.status === 'IN_PROGRESS').length;

    // Change status
    await prisma.request.update({
      where: { id: request.id },
      data: { status: 'IN_PROGRESS' },
    });

    // Verify update
    allRequests = await prisma.request.findMany();
    const newOpen = allRequests.filter((r) => r.status === 'OPEN').length;
    const newInProgress = allRequests.filter((r) => r.status === 'IN_PROGRESS').length;

    expect(newOpen).toBe(initialOpen - 1);
    expect(newInProgress).toBe(initialInProgress + 1);
  });

  it('should filter requests by category correctly', async () => {
    await prisma.request.createMany({
      data: [
        {
          title: 'IT Request',
          description: 'IT',
          category: 'TI',
          status: 'OPEN',
          requester_id: userId,
        },
        {
          title: 'HR Request',
          description: 'HR',
          category: 'RH',
          status: 'OPEN',
          requester_id: userId,
        },
        {
          title: 'Another IT Request',
          description: 'IT',
          category: 'TI',
          status: 'OPEN',
          requester_id: userId,
        },
      ],
    });

    const itRequests = await prisma.request.findMany({
      where: { category: 'TI' },
    });
    const hrRequests = await prisma.request.findMany({
      where: { category: 'RH' },
    });

    expect(itRequests).toHaveLength(2);
    expect(hrRequests).toHaveLength(1);
  });

  it('should handle empty dashboard state', async () => {
    const allRequests = await prisma.request.findMany();

    expect(allRequests).toHaveLength(0);
    expect(allRequests.filter((r) => r.status === 'OPEN')).toHaveLength(0);
    expect(allRequests.filter((r) => r.status === 'IN_PROGRESS')).toHaveLength(0);
    expect(allRequests.filter((r) => r.status === 'DONE')).toHaveLength(0);
  });

  it('should count requests by requester', async () => {
    // Create another user
    const passwordHash = await bcrypt.hash('test123', 10);
    const user2 = await prisma.user.create({
      data: {
        username: 'testuser2',
        name: 'Test User 2',
        password_hash: passwordHash,
      },
    });

    // Create requests for both users
    await prisma.request.createMany({
      data: [
        {
          title: 'User 1 Request 1',
          description: 'User 1',
          category: 'TI',
          status: 'OPEN',
          requester_id: userId,
        },
        {
          title: 'User 1 Request 2',
          description: 'User 1',
          category: 'TI',
          status: 'OPEN',
          requester_id: userId,
        },
        {
          title: 'User 2 Request 1',
          description: 'User 2',
          category: 'TI',
          status: 'OPEN',
          requester_id: user2.id,
        },
      ],
    });

    const user1Requests = await prisma.request.findMany({
      where: { requester_id: userId },
    });
    const user2Requests = await prisma.request.findMany({
      where: { requester_id: user2.id },
    });

    expect(user1Requests).toHaveLength(2);
    expect(user2Requests).toHaveLength(1);
  });
});
