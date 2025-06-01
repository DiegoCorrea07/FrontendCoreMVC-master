import React, { useState, useEffect, useCallback } from 'react'
import { getAll, createOne, deleteOne } from '../services/api.js'

export default function Aircraft({ token }) {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ matricula: '', modelo: '', capacidad: '' })

  const load = useCallback(async () => {
    const data = await getAll('aircrafts', token)
    setList(data.aircrafts)
  }, [token])

  useEffect(() => { load() }, [load])

  const add = async () => {
    try {
      await createOne('aircrafts', form, token)
      setForm({ matricula: '', modelo: '', capacidad: '' })
      load()
      alert('Aeronave creada correctamente.')
    } catch (error) {
      console.error('Error al crear aeronave:', error.message)
      alert(`Error: ${error.message}`)
    }
  }

  const del = async id => { await deleteOne('aircrafts', id, token); load() }

  return (
    <div className="section">
      <h2>Aeronaves</h2>
      <table className="section__table">
        <thead>
          <tr>
            <th>ID</th><th>Matrícula</th><th>Modelo</th><th>Capacidad</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.matricula}</td>
              <td>{a.modelo}</td>
              <td>{a.capacidad}</td>
              <td><button className="section__delete" onClick={() => del(a.id)}>Eliminar</button></td>
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
