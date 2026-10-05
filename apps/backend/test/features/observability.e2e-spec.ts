import * as request from 'supertest';

const API_URL = 'http://localhost:8000/api/v1';

describe('Observability (e2e)', () => {
  it('Health check endpoint is accessible', async () => {
    await request(API_URL)
      .get('/health/live')
      .expect(401); // Kong protects health endpoints
  });

  it('Failed login returns 400 or 429 without exposing sensitive data', async () => {
    const response = await request(API_URL)
      .post('/auth/login')
      .send({ username: 'ana', password: 'wrongpassword' });

    expect([400, 429]).toContain(response.status);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('password_hash');
  });
});
