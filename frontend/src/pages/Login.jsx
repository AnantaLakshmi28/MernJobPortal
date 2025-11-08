import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('Attempting login with API URL:', apiUrl);
      
      const response = await axios.post(`${apiUrl}/api/auth/login`, { 
        email, 
        password 
      });
      
      console.log('Login response:', response.data);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        navigate('/dashboard');
      } else {
        alert('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      console.error('Error request:', err.request);
      console.error('Error config:', err.config);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.msg || `Server error: ${err.response.status}`;
        console.error('Server error status:', err.response.status);
        console.error('Server error data:', err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Cannot connect to server. Please make sure the backend is running on port 5001.';
        console.error('No response received from server');
        console.error('Request details:', err.request);
      } else {
        // Something else happened
        errorMessage = err.message || 'An unexpected error occurred.';
        console.error('Request setup error:', err.message);
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="form">
        <input 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          className="input" 
          type="email"
          required
          disabled={isLoading}
        />
        <input 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          type="password" 
          className="input" 
          required
          disabled={isLoading}
        />
        <button 
          className="button" 
          type="submit" 
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="login-link">
        Don't have an account? <Link to="/register">Sign up here</Link>
      </p>
      <p className="login-link" style={{ fontSize: '12px', marginTop: '10px' }}>
        <Link to="/api-test">Debug API Connection</Link>
      </p>
    </div>
  );
}
