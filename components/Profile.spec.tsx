import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Profile from './Profile';

vi.mock('@auth0/nextjs-auth0/client');
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

import { useUser } from '@auth0/nextjs-auth0/client';
const mockUseUser = vi.mocked(useUser);

const invalidate = vi.fn().mockResolvedValue(undefined);

describe('Profile', () => {
  it('shows loading state', () => {
    mockUseUser.mockReturnValue({
      user: undefined,
      isLoading: true,
      error: undefined,
      invalidate,
    });
    render(<Profile />);
    expect(screen.getByText('Loading user profile...')).toBeInTheDocument();
  });

  it('renders nothing when no user', () => {
    mockUseUser.mockReturnValue({
      user: undefined,
      isLoading: false,
      error: undefined,
      invalidate,
    });
    const { container } = render(<Profile />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders user name and email', () => {
    mockUseUser.mockReturnValue({
      user: {
        name: 'Alice',
        email: 'alice@test.com',
        picture: 'https://pic.com/a.jpg',
        sub: 'auth0|1',
      },
      isLoading: false,
      error: null,
      invalidate,
    });
    render(<Profile />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice@test.com')).toBeInTheDocument();
  });

  it('renders profile picture with correct alt', () => {
    mockUseUser.mockReturnValue({
      user: {
        name: 'Alice',
        email: 'alice@test.com',
        picture: 'https://pic.com/a.jpg',
        sub: 'auth0|1',
      },
      isLoading: false,
      error: null,
      invalidate,
    });
    render(<Profile />);
    expect(screen.getByAltText('Alice profile')).toBeInTheDocument();
  });

  it('falls back to User when name is missing', () => {
    mockUseUser.mockReturnValue({
      user: {
        name: undefined,
        email: 'alice@test.com',
        picture: undefined,
        sub: 'auth0|1',
      },
      isLoading: false,
      error: null,
      invalidate,
    });
    render(<Profile />);
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByAltText('User profile')).toBeInTheDocument();
  });

  it('uses fallback avatar when picture is missing', () => {
    mockUseUser.mockReturnValue({
      user: {
        name: 'Alice',
        email: 'alice@test.com',
        picture: undefined,
        sub: 'auth0|1',
      },
      isLoading: false,
      error: null,
      invalidate,
    });
    render(<Profile />);
    const img = screen.getByAltText('Alice profile') as HTMLImageElement;
    expect(img.src).toContain('data:image/svg+xml');
  });
});
