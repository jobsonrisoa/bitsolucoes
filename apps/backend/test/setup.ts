import * as request from 'supertest';

const API_URL = 'http://localhost:8000/api/v1';

export async function getAuthToken(): Promise<string> {
  let retries = 10;
  while (retries > 0) {
    const loginResponse = await request(API_URL)
      .post('/auth/login')
      .send({ username: 'ana', password: 'demo123' });

    if (loginResponse.status === 200) {
      return loginResponse.headers['set-cookie'][0];
    }
    if (loginResponse.status === 429) {
      retries--;
      await new Promise(resolve => setTimeout(resolve, 3000));
      continue;
    }
    throw new Error(`Failed to authenticate: ${loginResponse.status}`);
  }
  throw new Error('Failed to authenticate after retries');
}

export const API_URL_BASE = API_URL;
