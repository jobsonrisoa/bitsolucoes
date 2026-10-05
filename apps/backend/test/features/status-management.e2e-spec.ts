import * as request from 'supertest';
import { getAuthToken, API_URL_BASE } from '../setup';

const API_URL = API_URL_BASE;

describe('Status management (e2e)', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getAuthToken();
  }, 60000);

  it('Open to In Progress transition', async () => {
    const createResponse = await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: 'Status transition test',
        description: 'Testing status transitions',
        category: 'TI',
      })
      .expect(201);

    const response = await request(API_URL)
      .patch(`/requests/${createResponse.body.id}/status`)
      .set('Cookie', authToken)
      .send({ status: 'IN_PROGRESS' })
      .expect(200);

    expect(response.body.status).toBe('IN_PROGRESS');
  });

  it('In Progress to Done transition', async () => {
    const createResponse = await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: 'Status transition test 2',
        description: 'Testing status transitions',
        category: 'RH',
      })
      .expect(201);

    await request(API_URL)
      .patch(`/requests/${createResponse.body.id}/status`)
      .set('Cookie', authToken)
      .send({ status: 'IN_PROGRESS' })
      .expect(200);

    const response = await request(API_URL)
      .patch(`/requests/${createResponse.body.id}/status`)
      .set('Cookie', authToken)
      .send({ status: 'DONE' })
      .expect(200);

    expect(response.body.status).toBe('DONE');
  });

  it('Cannot transition from Done to In Progress', async () => {
    const createResponse = await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: 'Status transition test 3',
        description: 'Testing status transitions',
        category: 'COMPRAS',
      })
      .expect(201);

    await request(API_URL)
      .patch(`/requests/${createResponse.body.id}/status`)
      .set('Cookie', authToken)
      .send({ status: 'IN_PROGRESS' })
      .expect(200);

    await request(API_URL)
      .patch(`/requests/${createResponse.body.id}/status`)
      .set('Cookie', authToken)
      .send({ status: 'DONE' })
      .expect(200);

    await request(API_URL)
      .patch(`/requests/${createResponse.body.id}/status`)
      .set('Cookie', authToken)
      .send({ status: 'IN_PROGRESS' })
      .expect(409);
  });

  it('Invalid status value is rejected', async () => {
    const createResponse = await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: 'Invalid status test',
        description: 'Testing invalid status',
        category: 'FINANCEIRO',
      })
      .expect(201);

    await request(API_URL)
      .patch(`/requests/${createResponse.body.id}/status`)
      .set('Cookie', authToken)
      .send({ status: 'INVALID_STATUS' })
      .expect(400);
  });

  it('Get request details', async () => {
    const createResponse = await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: 'Get details test',
        description: 'Testing get request details',
        category: 'INFRAESTRUTURA',
      })
      .expect(201);

    const response = await request(API_URL)
      .get(`/requests/${createResponse.body.id}`)
      .set('Cookie', authToken)
      .expect(200);

    expect(response.body).toHaveProperty('id', createResponse.body.id);
    expect(response.body).toHaveProperty('title', 'Get details test');
    expect(response.body).toHaveProperty('description', 'Testing get request details');
    expect(response.body).toHaveProperty('category', 'INFRAESTRUTURA');
    expect(response.body).toHaveProperty('status', 'OPEN');
    expect(response.body).toHaveProperty('createdAt');
  });
});
