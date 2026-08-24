import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { AdminProvider } from './context/AdminContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>,
)
