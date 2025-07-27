import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface User {
  username: string;
  hashedPassword: string;
}

let users: User[] | null = null;

function initializeUsers(): User[] {
  if (!users) {
    users = [
      {
        username: 'admin',
        hashedPassword: bcrypt.hashSync(process.env.USER_PASSWORD || 'password', 10)
      },
      {
        username: 'public', 
        hashedPassword: bcrypt.hashSync(process.env.USER_PASSWORD || 'password', 10)
      }
    ];
  }
  return users;
}

export function validateUser(username: string, password: string): boolean {
  const userList = initializeUsers();
  const user = userList.find(u => u.username === username);
  if (!user) return false;
  
  return bcrypt.compareSync(password, user.hashedPassword);
}

export function getUser(username: string): User | undefined {
  const userList = initializeUsers();
  return userList.find(u => u.username === username);
}

export function generateAiToken(username: string): string {
  const secret = process.env.AI_JWT_SECRET;
  if (!secret) throw new Error('AI_JWT_SECRET not configured');
  
  return jwt.sign({ username, type: 'ai' }, secret, { expiresIn: '24h' });
}

export function generateMcpToken(username: string): string {
  const secret = process.env.MCP_JWT_SECRET;
  if (!secret) throw new Error('MCP_JWT_SECRET not configured');
  
  return jwt.sign({ username, type: 'mcp' }, secret, { expiresIn: '24h' });
}

export function verifyAiToken(token: string): { username: string } | null {
  try {
    const secret = process.env.AI_JWT_SECRET;
    if (!secret) return null;
    
    const decoded = jwt.verify(token, secret) as { username: string; type: string };
    if (decoded.type !== 'ai') return null;
    
    return { username: decoded.username };
  } catch {
    return null;
  }
}

export function verifyMcpToken(token: string): { username: string } | null {
  try {
    const secret = process.env.MCP_JWT_SECRET;
    if (!secret) return null;
    
    const decoded = jwt.verify(token, secret) as { username: string; type: string };
    if (decoded.type !== 'mcp') return null;
    
    return { username: decoded.username };
  } catch {
    return null;
  }
}