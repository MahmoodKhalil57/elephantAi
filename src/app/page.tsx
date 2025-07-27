'use client';

import { useState, useEffect } from 'react';
import ChatBot from "../components/ChatBot";
import LoginForm from "../components/LoginForm";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        if (data.username) {
          setUsername(data.username);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (user: string) => {
    setUsername(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUsername('');
    }
  };

  if (isLoading) {
    return (
      <div className="font-sans min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen p-8 bg-gray-50">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🐘 Elephant AI
          </h1>
          <p className="text-lg text-gray-600">
            Chat with the Secret Elephant powered by OpenAI and MCP
          </p>
          {isAuthenticated && username && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <span className="text-sm text-gray-500">Welcome, {username}!</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        
        {isAuthenticated ? (
          <ChatBot />
        ) : (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        )}
      </main>
    </div>
  );
}
