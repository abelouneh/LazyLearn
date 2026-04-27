import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [token, setToken] = useState(null);

  // Check if we already logged in previously
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Lazy Learn 🧠</h1>
        {token && <button onClick={handleLogout} className="logout-btn">Logout</button>}
      </header>
      
      <main>
        {/* If we have a token, show Dashboard. Otherwise, show Auth screen */}
        {token ? <Dashboard /> : <Auth setToken={setToken} />}
      </main>
    </div>
  );
}

export default App;