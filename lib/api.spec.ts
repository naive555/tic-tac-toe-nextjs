import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', () => ({
  default: {
    create: vi.fn().mockReturnValue({}),
  },
}));

const mockCreate = vi.mocked(axios.create);

beforeEach(() => {
  mockCreate.mockClear();
});

describe('serverApi', () => {
  it('creates axios instance with correct baseURL and auth header', async () => {
    const { serverApi, BACKEND_URL } = await import('./api');

    serverApi('my-token');

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: `${BACKEND_URL}/api`,
      headers: {
        Authorization: 'Bearer my-token',
      },
    });
  });

  it('uses different token per call', async () => {
    const { serverApi } = await import('./api');

    serverApi('token-a');
    serverApi('token-b');

    expect(mockCreate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ headers: { Authorization: 'Bearer token-a' } }),
    );
    expect(mockCreate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ headers: { Authorization: 'Bearer token-b' } }),
    );
  });

  it('uses BACKEND_URL env var when set', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com');
    vi.resetModules();

    const { serverApi } = await import('./api');
    serverApi('tok');

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: 'https://api.example.com/api' }),
    );

    vi.unstubAllEnvs();
  });
});
