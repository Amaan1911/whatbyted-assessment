import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from './Button'
import { useAuth } from '../features/auth/state/AuthContext'

export default function Navbar() {
  const { logout } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">Gig Tasks</Link>
        <div className="flex gap-2">
          {loc.pathname !== '/tasks/new' && (
            <Button className="bg-blue-600 text-white" onClick={() => nav('/tasks/new')}>
              + New Task
            </Button>
          )}
          <Button onClick={async () => { await logout(); nav('/login'); }}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
