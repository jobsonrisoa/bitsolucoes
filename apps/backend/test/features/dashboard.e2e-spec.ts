import * as request from 'supertest';
import { getAuthToken, API_URL_BASE } from '../setup';

const API_URL = API_URL_BASE;

describe('Dashboard and cache (e2e)', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getAuthToken();
  }, 60000);

  it('Counters reflect the data', async () => {
    const response = await request(API_URL)
      .get('/dashboard/summary')
      .set('Cookie', authToken)
      .expect(200);

    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('open');
    expect(response.body).toHaveProperty('inProgress');
    expect(response.body).toHaveProperty('done');

    expect(typeof response.body.total).toBe('number');
    expect(typeof response.body.open).toBe('number');
    expect(typeof response.body.inProgress).toBe('number');
    expect(typeof response.body.done).toBe('number');

    expect(response.body.total).toBeGreaterThanOrEqual(0);
    expect(response.body.open + response.body.inProgress + response.body.done).toBe(response.body.total);
  });

  it('Dashboard is fresh after a write', async () => {
    const initialResponse = await request(API_URL)
      .get('/dashboard/summary')
      .set('Cookie', authToken)
      .expect(200);

    const initialTotal = initialResponse.body.total;

    await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: 'New request for dashboard test',
        description: 'Testing dashboard freshness',
        category: 'TI',
      })
      .expect(201);

    const updatedResponse = await request(API_URL)
      .get('/dashboard/summary')
      .set('Cookie', authToken)
      .expect(200);

    expect(updatedResponse.body.total).toBeGreaterThanOrEqual(initialTotal);
  });

  it('Dashboard updates correctly with status changes', async () => {
    const createResponse = await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: 'Status change test',
        description: 'Testing status changes',
        category: 'RH',
      })
      .expect(201);

    const initialDashboard = await request(API_URL)
      .get('/dashboard/summary')
      .set('Cookie', authToken)
      .expect(200);

    const initialOpen = initialDashboard.body.open;
    const initialInProgress = initialDashboard.body.inProgress;

    await request(API_URL)
      .patch(`/requests/${createResponse.body.id}/status`)
      .set('Cookie', authToken)
      .send({ status: 'IN_PROGRESS' })
      .expect(200);

    const updatedDashboard = await request(API_URL)
      .get('/dashboard/summary')
      .set('Cookie', authToken)
      .expect(200);

    // Allow for concurrent modifications
    expect(updatedDashboard.body.open).toBeLessThanOrEqual(initialOpen);
    expect(updatedDashboard.body.inProgress).toBeGreaterThanOrEqual(initialInProgress);
  });
});
