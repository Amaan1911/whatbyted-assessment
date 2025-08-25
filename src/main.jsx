import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import RoutesRoot from './app/routes'
import { AuthProvider } from './features/auth/state/AuthContext'
import { TaskProvider } from './features/tasks/state/TaskContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <RoutesRoot />
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
