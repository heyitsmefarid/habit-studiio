import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import { SmoothScroll } from './lib/smooth'
import './styles/index.css'

// Hash routing for single-file previews; clean URLs everywhere else.
const Router = import.meta.env.VITE_HASH_ROUTER === '1' ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <SmoothScroll>
        <App />
      </SmoothScroll>
    </Router>
  </StrictMode>,
)
