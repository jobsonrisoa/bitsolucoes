import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, fetchApi } from './client';

describe('fetchApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('prefixes API paths and sends same-origin credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchApi('/auth/me')).resolves.toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/auth/me', {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('throws when the backend returns an error status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({ message: 'UNAUTHENTICATED' }),
      }),
    );

    await expect(fetchApi('/dashboard/summary')).rejects.toMatchObject({
      name: 'ApiError',
      message: 'UNAUTHENTICATED',
      status: 401,
    } satisfies Partial<ApiError>);
  });
});
