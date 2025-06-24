
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize autonomous webhook service immediately
try {
  import('./services/autonomousWebhookService');
} catch (error) {
  console.error('Failed to initialize autonomous webhook service:', error);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Failed to render application:', error);
  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: #1a1a1a; color: white; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Application Error</h1>
        <p style="color: #888;">Please refresh the page or contact support.</p>
      </div>
    </div>
  `;
}
