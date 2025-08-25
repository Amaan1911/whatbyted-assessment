import { createContext, useContext, useEffect, useReducer } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../../app/firebase'

const AuthContext = createContext()

const initial = { user: null, loading: true }

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN': return { ...state, user: action.payload, loading: false }
    case 'LOGOUT': return { ...state, user: null, loading: false }
    case 'LOADING': return { ...state, loading: true }
    default: return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) dispatch({ type: 'LOGIN', payload: user })
      else dispatch({ type: 'LOGOUT' })
    })
    return () => unsub()
  }, [])

  const logout = async () => await signOut(auth)

  return (
    <AuthContext.Provider value={{ ...state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
