import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/auth.css'
import App from './App.jsx'
import initializeEcho from './echo';

// Initialize Echo before React app starts
initializeEcho();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
