import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const auth = request.cookies.get('auth');
  
  if (auth && auth.value) {
    return NextResponse.json({ authenticated: true, username: auth.value });
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}