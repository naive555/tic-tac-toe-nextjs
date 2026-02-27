import { auth0 } from '@/lib/auth0';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { serverApi } from '../../../../lib/api';

export async function GET(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const api = serverApi(session.tokenSet.accessToken);
    const res = await api.get('/api/scores/me');

    return NextResponse.json(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json({ message: 'Unexpected error' }, { status: 500 });
  }
}
