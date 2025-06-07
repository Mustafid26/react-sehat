import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import { IMTProvider } from './context/IMTContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <IMTProvider>
        <App />
      </IMTProvider>
    </HashRouter>
  </StrictMode>
)
