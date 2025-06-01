import { useState, useEffect } from 'react';
import styles from "@/styles/Home.module.css";

const ApiControls = () => {
  const [message, setMessage] = useState('');
  const [healthStatus, setHealthStatus] = useState("Checking...");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    // Check health status when component mounts
    checkHealth();
  }, []);

  const sayHiToMom = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setMessage(data.message || 'Hi sent to Mom!');
    } catch (error) {
      console.error('Error saying hi to mom:', error);
      setMessage('Failed to say hi to Mom. Check console for details.');
    }
  };

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();
      setHealthStatus(data.status || 'API is running');
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus('API is not responding');
    }
  };

  return (
    <>
      <div className={styles.card}>
        <button onClick={sayHiToMom} className={styles.button}>
          Say Hi to Mom
        </button>

        {message && (
          <div className={styles.response}>
            <p>{message}</p>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h2>API Health Status</h2>
        <p className={styles.status}>Status: {healthStatus}</p>
        <button onClick={checkHealth} className={styles.refreshButton}>
          Refresh Status
        </button>
      </div>
    </>
  );
};

export default ApiControls; 