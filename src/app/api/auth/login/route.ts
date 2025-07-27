import { NextRequest, NextResponse } from 'next/server';
import { validateUser, generateAiToken, generateMcpToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (validateUser(username, password)) {
      const aiToken = generateAiToken(username);
      const mcpToken = generateMcpToken(username);
      
      const response = NextResponse.json({ 
        success: true, 
        username,
        aiToken,
        mcpToken 
      });
      
      response.cookies.set('ai_auth', aiToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/'
      });
      
      response.cookies.set('mcp_auth', mcpToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/'
      });
      
      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}