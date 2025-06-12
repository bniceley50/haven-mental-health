import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';

// Simple entry point - no analytics, no monitoring, no complexity
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);