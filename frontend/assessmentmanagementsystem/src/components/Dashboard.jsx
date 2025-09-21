import React, { useState } from 'react';
import { useAuth } from './Authcontext';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const generateReport = async (endpoint) => {
    if (!sessionId.trim()) {
      setError('Please enter a session ID');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`http://localhost:3000/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ session_id: sessionId })
      });

      // Handle different response types based on endpoint
      if (endpoint === 'generate-report-download') {
        // This endpoint returns JSON
        const data = await response.json();
        if (data.success) {
          setMessage(`Report generated successfully! File: ${data.file}`);
        } else {
          setError(data.message || 'Failed to generate report');
        }
      } else if (endpoint === 'generate-report-preview') {
        // This endpoint returns PDF file for download
        if (response.ok) {
          // Create download link for the PDF
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `report_${sessionId}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          setMessage('Report downloaded successfully!');
        } else {
          // If there's an error, try to parse error message
          try {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to generate report');
          } catch {
            setError('Failed to generate report');
          }
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Assessment Report Generator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}!</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Generate Assessment Report
          </h2>

          {/* Session ID Input */}
          <div className="mb-6">
            <label htmlFor="sessionId" className="block text-sm font-medium text-gray-700 mb-2">
              Session ID
            </label>
            <input
              type="text"
              id="sessionId"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Enter session ID (e.g., session_001)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Available session IDs: session_001, session_002
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => generateReport('generate-report-download')}
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Report (Save to Server)'}
            </button>
            
            <button
              onClick={() => generateReport('generate-report-preview')}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate & Download Report'}
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-gray-50 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">How it works:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>session_001</strong>: Health & Fitness Assessment (6 sections)</li>
              <li>• <strong>session_002</strong>: Cardiac Assessment (3 sections)</li>
              <li>• Reports are generated dynamically based on assessment configuration</li>
              <li>• Different assessment types show different sections automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;