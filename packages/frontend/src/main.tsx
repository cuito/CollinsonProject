import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadGoogleMaps } from "../loaders/googleMapsLoader";

useEffect(() => {
  loadGoogleMaps();
}, []);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
