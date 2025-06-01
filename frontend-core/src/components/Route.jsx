import React, { useState, useEffect, useCallback } from 'react'
import { getAll, createOne, deleteOne } from '../services/api.js'

export default function Route({ token }) {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ origen: '', destino: '', distancia: '' })

  const load = useCallback(async () => {
    const data = await getAll('routes', token)
    setList(data.routes)
  }, [token])

  useEffect(() => { load() }, [load])

  const add = async () => {
    await createOne('routes', form, token)
    setForm({ origen: '', destino: '', distancia: '' })
    load()
  }
  const del = async id => { await deleteOne('routes', id, token); load() }

  return (
    <div className="section">
      <h2>Rutas</h2>
      <table className="section__table">
        <thead>
          <tr>
            <th>ID</th><th>Origen</th><th>Destino</th><th>Distancia</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.origen}</td>
              <td>{r.destino}</td>
              <td>{r.distancia}</td>
              <td><button className="section__delete" onClick={() => del(r.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Agregar</h3>
      <div className="section__form">
        {Object.keys(form).map(k => (
          <input
            key={k}
            placeholder={k}
            value={form[k]}
            onChange={e => setForm({ ...form, [k]: e.target.value })}
          />
        ))}
        <button className="section__add" onClick={add}>Crear</button>
      </div>
    </div>
  )
}
