import * as request from 'supertest';
import { getAuthToken, API_URL_BASE } from '../setup';

const API_URL = API_URL_BASE;

describe('Request registration (e2e)', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getAuthToken();
  }, 60000);

  it('Create a valid request', async () => {
    const response = await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: 'New computer request',
        description: 'Need a new laptop for development work',
        category: 'TI',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title', 'New computer request');
    expect(response.body).toHaveProperty('status', 'OPEN');
    expect(response.body).toHaveProperty('category', 'TI');
  });

  it('Reject invalid data', async () => {
    await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: '', // Invalid: empty title
        description: 'Test',
        category: 'INVALID', // Invalid category
      })
      .expect(400);
  });

  it('Edit request while open', async () => {
    const createResponse = await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: 'Original title',
        description: 'Original description',
        category: 'RH',
      })
      .expect(201);

    const requestId = createResponse.body.id;

    const updateResponse = await request(API_URL)
      .patch(`/requests/${requestId}`)
      .set('Cookie', authToken)
      .send({
        title: 'Updated title',
        description: 'Updated description',
      })
      .expect(200);

    expect(updateResponse.body).toHaveProperty('title', 'Updated title');
    expect(updateResponse.body).toHaveProperty('description', 'Updated description');
  });

  it('Delete request while open', async () => {
    const createResponse = await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: 'To be deleted',
        description: 'This will be deleted',
        category: 'COMPRAS',
      })
      .expect(201);

    const requestId = createResponse.body.id;

    await request(API_URL)
      .delete(`/requests/${requestId}`)
      .set('Cookie', authToken)
      .expect(200);

    await request(API_URL)
      .get(`/requests/${requestId}`)
      .set('Cookie', authToken)
      .expect(404);
  });

  it('Cannot edit non-open request', async () => {
    const createResponse = await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: 'Test request',
        description: 'Test description',
        category: 'FINANCEIRO',
      })
      .expect(201);

    const requestId = createResponse.body.id;

    await request(API_URL)
      .patch(`/requests/${requestId}/status`)
      .set('Cookie', authToken)
      .send({ status: 'IN_PROGRESS' })
      .expect(200);

    await request(API_URL)
      .patch(`/requests/${requestId}`)
      .set('Cookie', authToken)
      .send({ title: 'Should not update' })
      .expect(409);
  });

  it('Cannot delete non-open request', async () => {
    const createResponse = await request(API_URL)
      .post('/requests')
      .set('Cookie', authToken)
      .send({
        title: 'Test request',
        description: 'Test description',
        category: 'INFRAESTRUTURA',
      })
      .expect(201);

    const requestId = createResponse.body.id;

    await request(API_URL)
      .patch(`/requests/${requestId}/status`)
      .set('Cookie', authToken)
      .send({ status: 'IN_PROGRESS' })
      .expect(200);

    await request(API_URL)
      .delete(`/requests/${requestId}`)
      .set('Cookie', authToken)
      .expect(409);
  });
});
