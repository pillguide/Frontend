import { StrictMode } from 'react'
import { Toaster } from "react-hot-toast";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
  position="top-center"
  toastOptions={{
    success: {
      style: {
        background: "#1e293b",
        color: "#fff",
        borderRadius: "12px",
        fontSize: "14px",
        padding: "12px 16px",
      },
      iconTheme: {
        primary: "#60a5fa",
        secondary: "#fff",
      },
    },
  }}
/>
  </StrictMode>,
)
