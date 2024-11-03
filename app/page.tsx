'use client'
import { useState, useEffect } from 'react';

const Home = () => {
  const backendURL=process.env.NEXT_PUBLIC_SERVER_URL as string;
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const startTime = performance.now();

    try {
      const response = await fetch(backendURL);
      const endTime = performance.now();
      const timeTaken = endTime - startTime;

      setResponseTime(timeTaken);
      setStatusCode(response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">API Metrics Dashboard</h1>
        
        {loading && <p className="text-lg text-yellow-500">Loading...</p>}
        
        {error && (
          <div className="mt-4 p-4 bg-red-600 text-white rounded">
            <p className="text-lg font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        {message && (
          <div className="mt-4 p-4 bg-green-600 text-white rounded">
            <h2 className="text-lg font-bold">Message:</h2>
            <p className="text-3xl font-semibold">{message}</p>
          </div>
        )}

        <div className="mt-4 p-4 bg-gray-700 text-white rounded">
          <h3 className="text-lg font-bold">Request Metrics:</h3>
          <p>Status Code: <span className="font-mono">{statusCode ?? 'N/A'}</span></p>
          <p>Response Time: <span className="font-mono">{responseTime ? `${responseTime.toFixed(2)} ms` : 'N/A'}</span></p>
        </div>

        <button
          onClick={fetchData}
          className="mt-6 w-full py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Retry Request
        </button>
      </div>
    </div>
  );
};

export default Home;
