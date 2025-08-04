"use client";

import { useState, useEffect } from 'react';

interface Question {
  timestamp: string;
  question: string;
}

interface LogData {
  questions: Question[];
  total: number;
  message: string;
}

export default function AdminPage() {
  const [logs, setLogs] = useState<LogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Check if already authenticated (stored in sessionStorage)
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchLogs();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        setAuthError('');
        fetchLogs();
      } else {
        setAuthError('Invalid password');
      }
    } catch {
      setAuthError('Authentication failed');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/logs');
      const data = await response.json();
      
      if (response.ok) {
        setLogs(data);
      } else {
        setError(data.error || 'Failed to fetch logs');
      }
    } catch {
      setError('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  placeholder="Enter admin password"
                />
              </div>
              
              {authError && (
                <div className="text-red-400 text-sm">{authError}</div>
              )}
              
              <button
                onClick={handleLogin}
                disabled={!password.trim()}
                className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Chatbot Question Logs</h1>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4">Loading logs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Chatbot Question Logs</h1>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
          <div className="bg-red-900 border border-red-700 rounded-lg p-4">
            <p className="text-red-200">Error: {error}</p>
            <button 
              onClick={fetchLogs}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Chatbot Question Logs</h1>
          <div className="flex space-x-4">
            <button 
              onClick={fetchLogs}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-white rounded-lg hover:opacity-90"
            >
              Refresh
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Total Questions</p>
              <p className="text-2xl font-bold text-pink-500">{logs?.total || 0}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-green-400">Logging Active</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Last Updated</p>
              <p className="text-blue-400">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {logs?.questions && logs.questions.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Questions</h2>
            {logs.questions.map((question, index) => (
              <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-400">
                    {formatDate(question.timestamp)}
                  </span>
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
                <p className="text-white">{question.question}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-400">No questions logged yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Questions will appear here once people start using the chatbot.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 