import React, { useState, useEffect, useCallback } from 'react'
import { getAll, createOne, deleteOne } from '../services/api.js'

export default function Event({ token }) {
  const [list, setList] = useState([])
  const [form, setForm] = useState({
    codigo_evento: '', nombre_evento: '', descripcion: '',
    fecha_inicio: '', fecha_fin: ''
  })

  const load = useCallback(async () => {
    const data = await getAll('events', token)
    setList(data.events)
  }, [token])

  useEffect(() => { load() }, [load])

  const add = async () => {
    await createOne('events', form, token)
    setForm({
      codigo_evento: '', nombre_evento: '', descripcion: '',
      fecha_inicio: '', fecha_fin: ''
    })
    load()
  }
  const del = async id => { await deleteOne('events', id, token); load() }

  return (
    <div className="section">
      <h2>Eventos</h2>
      <table className="section__table">
        <thead>
          <tr>
            <th>ID</th><th>Código</th><th>Nombre</th><th>Descripción</th><th>Inicio</th><th>Fin</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.codigo_evento}</td>
              <td>{e.nombre_evento}</td>
              <td>{e.descripcion}</td>
              <td>{e.fecha_inicio}</td>
              <td>{e.fecha_fin}</td>
              <td><button className="section__delete" onClick={() => del(e.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Agregar</h3>
      <div className="section__form">
        {Object.keys(form).map(k => (
          <input
            key={k}
            type={k.includes('fecha') ? 'date' : 'text'}
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
