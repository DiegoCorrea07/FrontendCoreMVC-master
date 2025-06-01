import React, { useState, useEffect, useCallback } from 'react'
import { getAll, createOne, deleteOne } from '../services/api.js'
import './User.css'

export default function User({ token }) {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ username: '', password: '', role: '' })

  const load = useCallback(async () => {
    const data = await getAll('users', token)
    setList(data.users)
  }, [token])

  useEffect(() => { load() }, [load])

  const add = async () => {
    await createOne('users', form, token)
    setForm({ username: '', password: '', role: '' })
    load()
  }
  const del = async id => { await deleteOne('users', id, token); load() }

  return (
    <div className="section-user">
      <h2>Usuarios</h2>
      <table className="section-user__table">
        <thead>
          <tr>
            <th>ID</th><th>Usuario</th><th>Rol</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td><button className="section-user__delete" onClick={() => del(u.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Agregar</h3>
      <div className="section-user__form">
        {Object.keys(form).map(k => (
          <input
            key={k}
            type={k === 'password' ? 'password' : 'text'}
            placeholder={k}
            value={form[k]}
            onChange={e => setForm({ ...form, [k]: e.target.value })}
          />
        ))}
        <button className="section-user__add" onClick={add}>Crear</button>
      </div>
    </div>
  )
}
