import { NextRequest, NextResponse } from 'next/server';
import { TempAuth } from '@/lib/temp-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await TempAuth.signIn(email, password);

    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    // Set session cookie
    response.cookies.set('session-token', result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to sign in' },
      { status: 400 }
    );
  }
}
