import { useState } from 'react';
import './App.css';
import AddressInput from './components/AddressInput';
import RankingTable from './components/RankingTable';

function App() {
  const [address, setAddress] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);

  const setAddressAndCoordinates = (address: string, coordinates: { lat: number, lng: number }) => {
    setAddress(address);
    setCoordinates(coordinates);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Search for destination</h1>
        <AddressInput value={address} setParentAddressAndCoordinates={setAddressAndCoordinates} onSelect={() => {}} />
        {address && coordinates && (
          <>
            <p>Address: <strong>{address}</strong></p>
            <p>Coordinates: <strong>{coordinates?.lat}, {coordinates?.lng}</strong></p>
          </>
        )}
      </header>
      {coordinates && <RankingTable latitude={coordinates.lat} longitude={coordinates.lng} />}
    </div>
  );
}

export default App;