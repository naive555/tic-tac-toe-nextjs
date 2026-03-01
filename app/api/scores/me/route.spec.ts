import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('@/lib/auth0');
vi.mock('@/lib/api');

import { auth0 } from '@/lib/auth0';
import { serverApi } from '@/lib/api';

const mockGetSession = vi.mocked(auth0.getSession);
const mockServerApi = vi.mocked(serverApi);
const mockApi = { get: vi.fn() };

beforeEach(() => {
  vi.clearAllMocks();
  mockServerApi.mockReturnValue(mockApi as never);
});

describe('GET /api/scores/me', async () => {
  const { GET } = await import('./route');

  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns my scores on success', async () => {
    mockGetSession.mockResolvedValueOnce({
      tokenSet: { accessToken: 'tok' },
    } as never);
    mockApi.get.mockResolvedValueOnce({
      data: { wins: 5, losses: 2, draws: 1 },
    });

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ wins: 5, losses: 2, draws: 1 });
    expect(mockApi.get).toHaveBeenCalledWith('/scores/me');
  });

  it('forwards axios error status', async () => {
    mockGetSession.mockResolvedValueOnce({
      tokenSet: { accessToken: 'tok' },
    } as never);
    const axiosError = new axios.AxiosError();
    axiosError.response = { data: 'Error', status: 403 } as never;
    mockApi.get.mockRejectedValueOnce(axiosError);

    const res = await GET();
    expect(res.status).toBe(403);
  });

  it('returns 500 on unexpected error', async () => {
    mockGetSession.mockResolvedValueOnce({
      tokenSet: { accessToken: 'tok' },
    } as never);
    mockApi.get.mockRejectedValueOnce(new Error('Unexpected'));

    const res = await GET();
    expect(res.status).toBe(500);
  });
});
