import { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        // Access environment variable with import.meta.env
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) {
          throw new Error("VITE_BACKEND_URL is not defined in frontend .env");
        }

        const response = await fetch(`${backendUrl}/hello`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (err: any) { 
        console.error("Failed to fetch message:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []); 

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (error) {
    return <div className="App" style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Frontend Connected!</h1>
        <p>Message from Backend: <strong>{message}</strong></p>
      </header>
    </div>
  );
}

export default App;