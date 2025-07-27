import { NextRequest, NextResponse } from 'next/server';
import { verifyAiToken, verifyMcpToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const aiAuth = request.cookies.get('ai_auth');
  const mcpAuth = request.cookies.get('mcp_auth');
  
  let username = null;
  
  if (aiAuth?.value) {
    const aiTokenData = verifyAiToken(aiAuth.value);
    if (aiTokenData) {
      username = aiTokenData.username;
    }
  }
  
  if (!username && mcpAuth?.value) {
    const mcpTokenData = verifyMcpToken(mcpAuth.value);
    if (mcpTokenData) {
      username = mcpTokenData.username;
    }
  }
  
  if (!username) {
    return NextResponse.json({ role: null }, { status: 401 });
  }
  
  const role = username === 'admin' ? 'admin' : 'public';
  
  return NextResponse.json({ 
    role, 
    username,
    isAdmin: role === 'admin'
  });
}