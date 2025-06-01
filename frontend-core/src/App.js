import React, { useState } from 'react'
import Login from './components/Auth/Login'
import Dashboard from './components/Dashboard'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  if (!token) {
    return <Login onLogin={tok => {
      localStorage.setItem('token', tok)
      setToken(tok)
    }} />
  }

  return <Dashboard token={token} onLogout={() => {
    localStorage.removeItem('token')
    setToken(null)
  }} />
}
