import * as request from 'supertest';
import { getAuthToken, API_URL_BASE } from '../setup';

const API_URL = API_URL_BASE;

describe('Search, filters and pagination (e2e)', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getAuthToken();
  }, 60000);

  it('List all requests', async () => {
    const response = await request(API_URL)
      .get('/requests')
      .set('Cookie', authToken)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.meta).toHaveProperty('total');
    expect(response.body.meta).toHaveProperty('page');
    expect(response.body.meta).toHaveProperty('limit');
  });

  it('Filter by category', async () => {
    const response = await request(API_URL)
      .get('/requests?category=TI')
      .set('Cookie', authToken)
      .expect(200);

    expect(response.body.data).toBeDefined();
    response.body.data.forEach((req: any) => {
      expect(req.category).toBe('TI');
    });
  });

  it('Filter by status', async () => {
    const response = await request(API_URL)
      .get('/requests?status=OPEN')
      .set('Cookie', authToken)
      .expect(200);

    expect(response.body.data).toBeDefined();
    response.body.data.forEach((req: any) => {
      expect(req.status).toBe('OPEN');
    });
  });

  it('Search by text (title)', async () => {
    const response = await request(API_URL)
      .get('/requests?q=computer')
      .set('Cookie', authToken)
      .expect(200);

    expect(response.body.data).toBeDefined();
    response.body.data.forEach((req: any) => {
      expect(req.title.toLowerCase()).toContain('computer');
    });
  });

  it('Combine multiple filters', async () => {
    const response = await request(API_URL)
      .get('/requests?category=TI&status=OPEN')
      .set('Cookie', authToken)
      .expect(200);

    expect(response.body.data).toBeDefined();
    response.body.data.forEach((req: any) => {
      expect(req.category).toBe('TI');
      expect(req.status).toBe('OPEN');
    });
  });

  it('Paginate results', async () => {
    const page1Response = await request(API_URL)
      .get('/requests?page=1&limit=5')
      .set('Cookie', authToken)
      .expect(200);

    expect(page1Response.body.meta.page).toBe(1);
    expect(page1Response.body.meta.limit).toBe(5);
    expect(page1Response.body.data.length).toBeLessThanOrEqual(5);

    if (page1Response.body.meta.totalPages > 1) {
      const page2Response = await request(API_URL)
        .get('/requests?page=2&limit=5')
        .set('Cookie', authToken)
        .expect(200);

      expect(page2Response.body.meta.page).toBe(2);
      expect(page2Response.body.data.length).toBeLessThanOrEqual(5);
    }
  });

  it('Sort results', async () => {
    const response = await request(API_URL)
      .get('/requests?sortBy=createdAt&sortOrder=desc')
      .set('Cookie', authToken)
      .expect(200);

    const data = response.body.data;
    if (data.length > 1) {
      for (let i = 0; i < data.length - 1; i++) {
        const date1 = new Date(data[i].createdAt);
        const date2 = new Date(data[i + 1].createdAt);
        expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
      }
    }
  });
});
