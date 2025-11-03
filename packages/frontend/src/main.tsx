import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadGoogleMaps } from "../loaders/googleMapsLoader";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!apiKey) throw new Error("Missing Google Maps API key");

loadGoogleMaps(apiKey);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
