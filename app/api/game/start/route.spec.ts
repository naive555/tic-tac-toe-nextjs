import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import axios from 'axios';

vi.mock('@/lib/auth0');
vi.mock('@/lib/api');

import { auth0 } from '@/lib/auth0';
import { serverApi } from '@/lib/api';

const mockGetSession = vi.mocked(auth0.getSession);
const mockServerApi = vi.mocked(serverApi);

const mockSession = {
  tokenSet: { accessToken: 'test-token' },
};

const mockApi = {
  post: vi.fn(),
  get: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  mockServerApi.mockReturnValue(mockApi as never);
});

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/game/start', {
    method: 'POST',
    body: JSON.stringify(body),
  });

describe('POST /api/game/start', async () => {
  const { POST } = await import('./route');

  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const res = await POST(makeRequest({ difficulty: 'MEDIUM' }));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ message: 'Unauthorized' });
  });

  it('returns new game on success', async () => {
    mockGetSession.mockResolvedValueOnce(mockSession as never);
    mockApi.post.mockResolvedValueOnce({ data: { id: 'game-123' } });

    const res = await POST(makeRequest({ difficulty: 'MEDIUM' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: 'game-123' });
    expect(mockApi.post).toHaveBeenCalledWith('/game/start', {
      difficulty: 'MEDIUM',
    });
  });

  it('forwards axios error status', async () => {
    mockGetSession.mockResolvedValueOnce(mockSession as never);
    const axiosError = new axios.AxiosError('Bad Request');
    axiosError.response = { data: 'Invalid difficulty', status: 400 } as never;
    mockApi.post.mockRejectedValueOnce(axiosError);

    const res = await POST(makeRequest({ difficulty: 'MEDIUM' }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: 'Invalid difficulty' });
  });

  it('returns 500 on unexpected error', async () => {
    mockGetSession.mockResolvedValueOnce(mockSession as never);
    mockApi.post.mockRejectedValueOnce(new Error('Unexpected'));

    const res = await POST(makeRequest({ difficulty: 'MEDIUM' }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ message: 'Unexpected error' });
  });
});
