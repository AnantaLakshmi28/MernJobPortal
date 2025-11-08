import React, { useState } from 'react';
import axios from 'axios';

export default function ApiTest() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, result, details = '') => {
    setResults(prev => [...prev, { test, result, details, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setResults([]);
    setLoading(true);
    
    // Test 1: Check environment variables
    addResult('Environment Variables', 'info', `VITE_API_URL: ${import.meta.env.VITE_API_URL || 'NOT SET'}`);
    
    // Test 2: Check server health
    try {
      const healthResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/health`);
      addResult('Server Health Check', 'success', `Status: ${healthResponse.status}, Data: ${JSON.stringify(healthResponse.data)}`);
    } catch (err) {
      addResult('Server Health Check', 'error', `Error: ${err.message}`);
    }
    
    // Test 3: Test registration
    try {
      const testUser = {
        name: 'Test User',
        email: `testuser${Date.now()}@example.com`,
        password: 'test123'
      };
      
      const regResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, testUser);
      addResult('Registration Test', 'success', `Response: ${JSON.stringify(regResponse.data)}`);
      
      // Test 4: Test login with newly created user
      try {
        const loginResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        addResult('Login Test', 'success', `Token received: ${loginResponse.data.token ? 'YES' : 'NO'}`);
      } catch (loginErr) {
        addResult('Login Test', 'error', `Login failed: ${loginErr.response?.data?.msg || loginErr.message}`);
      }
      
    } catch (err) {
      addResult('Registration Test', 'error', `Error: ${err.response?.data?.msg || err.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API Connection Test</h1>
      <button onClick={runTests} disabled={loading} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        {loading ? 'Running Tests...' : 'Run API Tests'}
      </button>
      
      <div>
        {results.map((result, index) => (
          <div key={index} style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            marginBottom: '10px',
            backgroundColor: result.result === 'success' ? '#e8f5e8' : result.result === 'error' ? '#ffe8e8' : '#f0f0f0'
          }}>
            <strong>{result.test}</strong> - 
            <span style={{ color: result.result === 'success' ? 'green' : result.result === 'error' ? 'red' : 'blue' }}>
              {result.result.toUpperCase()}
            </span>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              {result.details}
            </div>
            <div style={{ fontSize: '10px', color: '#999' }}>
              {result.timestamp}
            </div>
          </div>
        ))}
      </div>
      
      {results.length === 0 && (
        <p>Click "Run API Tests" to start testing the connection between frontend and backend.</p>
      )}
    </div>
  );
}