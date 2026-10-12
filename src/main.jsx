import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AccountScopedApp from './components/AccountScopedApp.jsx'
import { startAccountSync } from './sync/account.js'

startAccountSync()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccountScopedApp />
  </StrictMode>,
)
