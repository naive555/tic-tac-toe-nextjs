import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile email',
  },
});

export async function getUser() {
  const session = await auth0.getSession();

  if (!session?.user) return null;

  return {
    id: session.user.sub ?? '',
    username: session.user.name ?? 'User',
  };
}
