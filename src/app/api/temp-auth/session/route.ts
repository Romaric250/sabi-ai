import { NextRequest, NextResponse } from 'next/server';
import { TempAuth } from '@/lib/temp-auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session-token')?.value;

    if (!token) {
      return NextResponse.json({ user: null, session: null });
    }

    const result = await TempAuth.getSession(token);

    if (!result) {
      return NextResponse.json({ user: null, session: null });
    }

    return NextResponse.json({
      user: result.user,
      session: result.session,
    });
  } catch (error) {
    return NextResponse.json({ user: null, session: null });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('session-token')?.value;

    if (token) {
      await TempAuth.signOut(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('session-token');

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}
