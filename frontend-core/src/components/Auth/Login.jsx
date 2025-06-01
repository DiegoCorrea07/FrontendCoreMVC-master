import React, { useState } from 'react'
import { login } from '../../services/api.js'
import './Login.css'

export default function Login({ onLogin }) {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')

  const submit = async e => {
    e.preventDefault()
    setErr('')
    const r = await login(u, p)
    if (r.token) onLogin(r.token)
    else setErr(r.error || 'Credenciales inválidas')
  }

  return (
      <div className="login-container">
        <form className="login-box" onSubmit={submit}>
          <h2 className="login-heading">Iniciar Sesión</h2>
          {err && <div className="login-error">{err}</div>}

          <div className="input-group">
            <label className="input-label">Usuario</label>
            <input className="input-field" placeholder="Usuario" value={u} onChange={e => setU(e.target.value)}
                   required/>
          </div>

          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <input type="password" className="input-field" placeholder="Contraseña" value={p}
                   onChange={e => setP(e.target.value)} required/>
          </div>

          <button type="submit" className="login-button">Ingresar</button>
          {/*
            <div className="register-text">
              ¿No tienes cuenta? <a className="register-link" href="#">Regístrate</a>
            </div>
          */}
        </form>
      </div>
  )
}
