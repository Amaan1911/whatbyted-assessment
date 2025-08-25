import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../../app/firebase'
import Input from '../../../components/Input'
import Button from '../../../components/Button'

export default function Register() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      nav('/')
    } catch (err) {
      const msg = err?.code === 'auth/weak-password' ? 'Use a stronger password (6+ chars).' :
                  err?.code === 'auth/email-already-in-use' ? 'Email already in use.' :
                  'Registration failed.'
      setError(msg)
    }
  }

  // 👉 Google Sign-Up
  const handleGoogleRegister = async () => {
    setError('')
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      nav('/')
    } catch (err) {
      console.error(err)
      setError('Google sign-up failed.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <form 
        onSubmit={handleRegister} 
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-96 border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Create Account</h2>
        
        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        {/* Email + Password */}
        <div className="space-y-4">
          <Input 
            type="email" 
            label="Email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            label="Password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required 
          />
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6 rounded-xl py-3 text-lg shadow-md transition">
          Register
        </Button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Sign-Up */}
        <Button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center justify-center gap-3 py-3 shadow-sm transition"
        >
          <img 
            src="https://www.svgrepo.com/show/355037/google.svg" 
            alt="Google" 
            className="w-5 h-5" 
          />
          Sign up with Google
        </Button>

        <p className="text-sm mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link className="text-blue-600 font-semibold hover:underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
