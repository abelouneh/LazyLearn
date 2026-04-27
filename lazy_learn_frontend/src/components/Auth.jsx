import { useState } from 'react';
import axios from 'axios';
import './Auth.css';

export default function Auth({ setToken }) {
  // State to toggle between Login and Register modes
  const [isLogin, setIsLogin] = useState(true);
  
  // State for the form data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State for messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Decide which backend door to use based on the toggle
    const url = isLogin 
      ? 'http://127.0.0.1:8000/api/login/' 
      : 'http://127.0.0.1:8000/api/register/';

    try {
      const response = await axios.post(url, {
        username: username,
        password: password
      });

      if (isLogin) {
        // If logging in, Django sends a token. Save it and unlock the app
        const token = response.data.token;
        localStorage.setItem('token', token); // Save to browser memory
        setToken(token); // Tell React the user is authenticated
      } else {
        // If registering, show a success message and switch to login mode
        setSuccess("Registration successful! You can now log in.");
        setIsLogin(true);
        setPassword(''); // Clear the password field for safety
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (err.response && err.response.data) {
        // Show the exact error Django sent back (e.g., "Username already taken")
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Failed to connect to the server.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Teacher Login' : 'Register New Account'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="auth-btn">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
}