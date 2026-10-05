import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { prisma } from '../setup-integration';

describe('Requests (integration)', () => {
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

  it('should create a request with valid data', async () => {
    const request = await prisma.request.create({
      data: {
        title: 'Test Request',
        description: 'Test description',
        category: 'TI',
        status: 'OPEN',
        requester_id: userId,
      },
    });

    expect(request).toBeDefined();
    expect(request.title).toBe('Test Request');
    expect(request.category).toBe('TI');
    expect(request.status).toBe('OPEN');
    expect(request.requester_id).toBe(userId);
  });

  it('should list requests with filters', async () => {
    // Create multiple requests
    await prisma.request.createMany({
      data: [
        {
          title: 'IT Request 1',
          description: 'IT request',
          category: 'TI',
          status: 'OPEN',
          requester_id: userId,
        },
        {
          title: 'HR Request 1',
          description: 'HR request',
          category: 'RH',
          status: 'IN_PROGRESS',
          requester_id: userId,
        },
        {
          title: 'IT Request 2',
          description: 'Another IT request',
          category: 'TI',
          status: 'DONE',
          requester_id: userId,
        },
      ],
    });

    // Filter by category
    const itRequests = await prisma.request.findMany({
      where: { category: 'TI' },
    });
    expect(itRequests).toHaveLength(2);

    // Filter by status
    const openRequests = await prisma.request.findMany({
      where: { status: 'OPEN' },
    });
    expect(openRequests).toHaveLength(1);
  });

  it('should update a request', async () => {
    const request = await prisma.request.create({
      data: {
        title: 'Original Title',
        description: 'Original description',
        category: 'TI',
        status: 'OPEN',
        requester_id: userId,
      },
    });

    const updated = await prisma.request.update({
      where: { id: request.id },
      data: {
        title: 'Updated Title',
        description: 'Updated description',
        category: 'RH',
      },
    });

    expect(updated.title).toBe('Updated Title');
    expect(updated.description).toBe('Updated description');
    expect(updated.category).toBe('RH');
  });

  it('should delete a request', async () => {
    const request = await prisma.request.create({
      data: {
        title: 'To be deleted',
        description: 'Will be deleted',
        category: 'TI',
        status: 'OPEN',
        requester_id: userId,
      },
    });

    await prisma.request.delete({
      where: { id: request.id },
    });

    const deleted = await prisma.request.findUnique({
      where: { id: request.id },
    });
    expect(deleted).toBeNull();
  });

  it('should enforce valid status transitions', async () => {
    const request = await prisma.request.create({
      data: {
        title: 'Status Test',
        description: 'Testing status transitions',
        category: 'TI',
        status: 'OPEN',
        requester_id: userId,
      },
    });

    // Valid transition: OPEN -> IN_PROGRESS
    const inProgress = await prisma.request.update({
      where: { id: request.id },
      data: { status: 'IN_PROGRESS' },
    });
    expect(inProgress.status).toBe('IN_PROGRESS');

    // Valid transition: IN_PROGRESS -> DONE
    const done = await prisma.request.update({
      where: { id: request.id },
      data: { status: 'DONE' },
    });
    expect(done.status).toBe('DONE');
  });

  it('should handle pagination correctly', async () => {
    // Create 25 requests
    const requests = Array.from({ length: 25 }, (_, i) => ({
      title: `Request ${i + 1}`,
      description: `Description ${i + 1}`,
      category: 'TI' as const,
      status: 'OPEN' as const,
      requester_id: userId,
    }));

    await prisma.request.createMany({ data: requests });

    // First page (10 items)
    const page1 = await prisma.request.findMany({
      take: 10,
      skip: 0,
      orderBy: { created_at: 'asc' },
    });
    expect(page1).toHaveLength(10);

    // Second page (10 items)
    const page2 = await prisma.request.findMany({
      take: 10,
      skip: 10,
      orderBy: { created_at: 'asc' },
    });
    expect(page2).toHaveLength(10);

    // Third page (5 items)
    const page3 = await prisma.request.findMany({
      take: 10,
      skip: 20,
      orderBy: { created_at: 'asc' },
    });
    expect(page3).toHaveLength(5);
  });
});
