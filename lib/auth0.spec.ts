import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetSession = vi.fn();

vi.mock('@auth0/nextjs-auth0/server', () => ({
  Auth0Client: class {
    getSession = mockGetSession;
  },
}));

describe('getUser', () => {
  beforeEach(() => {
    vi.resetModules();
    mockGetSession.mockReset();
  });

  it('returns null when no session', async () => {
    mockGetSession.mockResolvedValue(null);
    const { getUser } = await import('./auth0');
    expect(await getUser()).toBeNull();
  });

  it('returns null when session has no user', async () => {
    mockGetSession.mockResolvedValue({ user: undefined });
    const { getUser } = await import('./auth0');
    expect(await getUser()).toBeNull();
  });

  it('maps session user correctly', async () => {
    mockGetSession.mockResolvedValue({
      user: { sub: 'auth0|123', name: 'John Doe' },
    });
    const { getUser } = await import('./auth0');
    expect(await getUser()).toEqual({ id: 'auth0|123', username: 'John Doe' });
  });

  it('uses fallback values when fields are missing', async () => {
    mockGetSession.mockResolvedValue({ user: {} });
    const { getUser } = await import('./auth0');
    expect(await getUser()).toEqual({ id: '', username: 'User' });
  });
});
