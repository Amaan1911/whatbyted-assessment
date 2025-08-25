import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import Dashboard from '../features/tasks/pages/Dashboard'
import TaskForm from '../features/tasks/pages/TaskForm'
import { useAuth } from '../features/auth/state/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-6">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function RoutesRoot() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/tasks/new" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
      <Route path="/tasks/:id" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
