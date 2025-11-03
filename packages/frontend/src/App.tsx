import { useState, useEffect } from 'react';
import './App.css';
import { request, gql } from 'graphql-request'; // Import for GraphQL requests
import AddressInput from './components/AddressInput';

function App() {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [address, setAddress] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    const fetchGraphQLMessage = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) {
          throw new Error("VITE_BACKEND_URL is not defined in frontend .env");
        }

        // Define your GraphQL query
        const query = gql`
          query HelloQuery {
            hello
          }
        `;

        // Send the GraphQL query
        const data: { hello: string } = await request(`${backendUrl}/api`, query);
        setMessage(data.hello); // Access the 'hello' field from the GraphQL response

      } catch (err: any) {
        console.error("Failed to fetch GraphQL message:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchGraphQLMessage();
  }, []);

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (error) {
    return <div className="App" style={{ color: 'red' }}>Error: {error}</div>;
  }

  const setAddressAndCoordinates = (address: string, coordinates: { lat: number, lng: number }) => {
    setAddress(address);
    setCoordinates(coordinates);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Search for destination</h1>
        <AddressInput value={address} setParentAddressAndCoordinates={setAddressAndCoordinates} onSelect={() => {}} />
        <p>Message from Backend (GraphQL): <strong>{message}</strong></p>
        {address && coordinates && (
          <>
            <p>Address: <strong>{address}</strong></p>
            <p>Coordinates: <strong>{coordinates?.lat}, {coordinates?.lng}</strong></p>
          </>
        )}
      </header>
    </div>
  );
}

export default App;