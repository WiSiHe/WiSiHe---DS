import type { APIRoute } from 'astro';
import { adminAuth } from '../../../lib/firebase/server';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  /* Get the ID token from the headers */
  const authHeader = request.headers.get('Authorization');
  const idToken = authHeader?.split('Bearer ')[1];

  if (!idToken) {
    return new Response('No token found', { status: 401 });
  }

  try {
    /* Verify the ID token */
    await adminAuth.verifyIdToken(idToken);

    /* Create session cookie (expires in 5 days) */
    const fiveDays = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: fiveDays,
    });

    /* Set cookie */
    cookies.set('session', sessionCookie, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: fiveDays,
    });

    return redirect('/paintings');
  } catch (error: any) {
    console.error('Session creation error', error);
    return new Response('Invalid token', { status: 401 });
  }
};
