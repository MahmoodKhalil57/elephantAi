import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAiToken } from '@/lib/auth';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const aiAuth = request.cookies.get('ai_auth');
    const mcpAuth = request.cookies.get('mcp_auth');
    
    if (!aiAuth?.value) {
      return NextResponse.json({ error: 'AI authentication required' }, { status: 401 });
    }
    
    if (!mcpAuth?.value) {
      return NextResponse.json({ error: 'MCP authentication required' }, { status: 401 });
    }

    const aiTokenData = verifyAiToken(aiAuth.value);
    if (!aiTokenData) {
      return NextResponse.json({ error: 'Invalid AI token' }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Only send MCP token to OpenAI, never the AI token
    const response = await client.responses.create({
      model: 'gpt-4.1',
      tools: [
        {
          type: 'mcp',
          server_label: 'secretElephant',
          server_url: `${process.env.SECRET_ELEPHANT_MCP_URL}/mcp`,
          require_approval: 'never',
          headers: {
            'Authorization': `Bearer ${mcpAuth.value}`
          }
        },
      ],
      input: message,
    });

    return NextResponse.json({ 
      response: response.output_text,
      usage: response.usage 
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}