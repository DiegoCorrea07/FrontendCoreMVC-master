import React, { useState, useEffect, useCallback } from 'react';
import { getAll, createOne, deleteOne } from '../services/api.js';
import './Styles.css';

export default function Flight({ token }) {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    codigo_vuelo: '',
    fecha_salida: '',
    fecha_llegada: '',
    ruta_evento_id: '',
    aeronave_id: ''
  });

  // Estado para las opciones de las rutas de eventos y aeronaves
  const [eventRoutes, setEventRoutes] = useState([]);
  const [aeronaves, setAeronaves] = useState([]);

  // Función para cargar los vuelos y las opciones para los selects
  const load = useCallback(async () => {
    try {
      const data = await getAll('flights', token);
      setList(data.flights);

      const dataEventRoutes = await getAll('event_routes', token);
      setEventRoutes(dataEventRoutes.event_routes);

      const dataAeronaves = await getAll('aircrafts', token);
      setAeronaves(dataAeronaves.aircrafts);

    } catch (error) {
      console.error('Error al cargar datos en Flight:', error);
      // Manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  }, [token]);

  // Cargar los datos al montar el componente
  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    try {
      const payload = {
        ...form,
        ruta_evento_id: parseInt(form.ruta_evento_id),
        aeronave_id: parseInt(form.aeronave_id)
      };
      await createOne('flights', payload, token);
      setForm({
        codigo_vuelo: '',
        fecha_salida: '',
        fecha_llegada: '',
        ruta_evento_id: '',
        aeronave_id: ''
      });
      load();
      alert('Vuelo creado exitosamente');
    } catch (error) {
      console.error('Error al crear vuelo:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Función para eliminar un vuelo
  const del = async id => {
    await deleteOne('flights', id, token);
    load();
  };

  return (
    <div className="section">
      <h2>Vuelos</h2>

      <table className="section__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Salida</th>
            <th>Llegada</th>
            <th>Ruta de Evento</th>
            <th>Aeronave</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.codigo_vuelo}</td>
              <td>{f.fecha_salida}</td>
              <td>{f.fecha_llegada}</td>
              <td>{f.ruta_evento ? `${f.ruta_evento.ruta.origen}-${f.ruta_evento.ruta.destino} (${f.ruta_evento.evento.nombre_evento})` : f.ruta_evento_id}</td>
              <td>{f.aeronave ? f.aeronave.matricula : f.aeronave_id}</td>
              <td>
                <button className="section__delete" onClick={() => del(f.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Agregar Vuelo</h3>
      <div className="section__form">
        {Object.keys(form).map(k => {
          if (k === 'ruta_evento_id') {
            return (
              <select
                key={k}
                value={form[k]}
                onChange={e => setForm({ ...form, [k]: parseInt(e.target.value) })}
              >
                <option value="">Seleccione Ruta de Evento</option>
                {eventRoutes.map(er => (
                  <option key={er.id} value={er.id}>
                    {`${er.ruta.origen}-${er.ruta.destino} (${er.evento.nombre_evento})`}
                  </option>
                ))}
              </select>
            );
          }
          if (k === 'aeronave_id') {
            return (
              <select
                key={k}
                value={form[k]}
                onChange={e => setForm({ ...form, [k]: parseInt(e.target.value) })}
              >
                <option value="">Seleccione Aeronave</option>
                {aeronaves.map(a => (
                  <option key={a.id} value={a.id}>{a.matricula}</option>
                ))}
              </select>
            );
          }

          return (
            <input
              key={k}
              type={k.includes('fecha') ? 'datetime-local' : 'text'}
              placeholder={k.replace('_', ' ')}
              value={form[k]}
              onChange={e => setForm({ ...form, [k]: e.target.value })}
            />
          );
        })}
        <button className="section__add" onClick={add}>Crear Vuelo</button>
      </div>
    </div>
  );
}