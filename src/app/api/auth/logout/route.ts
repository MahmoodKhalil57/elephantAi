import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.delete('ai_auth');
  response.cookies.delete('mcp_auth');
  
  return response;
}