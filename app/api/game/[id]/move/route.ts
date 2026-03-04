import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { serverApi } from '@/lib/api';
import { auth0 } from '@/lib/auth0';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const api = serverApi(session.tokenSet.accessToken);
    const body = await req.json();
    const res = await api.post(`/game/${id}/move`, body);

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
