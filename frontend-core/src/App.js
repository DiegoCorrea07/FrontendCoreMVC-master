import React, {useEffect, useState} from 'react'
import Login from './components/Auth/Login'
import Dashboard from './components/Dashboard'
import { jwtDecode } from "jwt-decode"

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(null)

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token)

      setRole(decoded.role)
      console.log('Rol detectado (decoded):', decoded.role);

    }
  }, [token])

  if (!token) {
    return <Login onLogin={tok => {
      localStorage.setItem('token', tok)
      setToken(tok)
    }} />
  }

  return <Dashboard token={token} role={role} onLogout={() => {
    localStorage.removeItem('token')
    setToken(null)
    setRole(null)
  }} />
}
