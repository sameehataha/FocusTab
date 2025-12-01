import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrwoserProvide } from './context/browser-extension.jsx' 

createRoot(document.getElementById('root')).render(
  <BrwoserProvide>
  <StrictMode>
    <App />
  </StrictMode>,
  </BrwoserProvide>
)
