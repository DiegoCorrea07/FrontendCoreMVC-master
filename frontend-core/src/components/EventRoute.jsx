import React, { useState, useEffect, useCallback } from 'react';
import { getAll, createOne, deleteOne } from '../services/api.js';
import './Styles.css'; // Asumiendo que tienes un archivo CSS general

export default function EventRoute({ token }) {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    ruta_id: '',
    evento_id: '',
    demanda_estimada: '',
  });

  // Estados para las opciones de los dropdowns de Rutas y Eventos
  const [rutas, setRutas] = useState([]);
  const [eventos, setEventos] = useState([]);

  // Función para cargar las rutas de evento y las opciones para los selects
  const load = useCallback(async () => {
    try {
      // Cargar rutas de evento existentes
      const dataEventRoutes = await getAll('event_routes', token);
      setList(dataEventRoutes.event_routes || []); // Asegurarse de que sea un array

      // Cargar opciones para los dropdowns de Rutas
      const dataRutas = await getAll('routes', token);
      setRutas(dataRutas.routes || []); // Asumiendo que el backend devuelve { routes: [...] }

      // Cargar opciones para los dropdowns de Eventos
      const dataEventos = await getAll('events', token);
      setEventos(dataEventos.events || []); // Asumiendo que el backend devuelve { events: [...] }

    } catch (error) {
      console.error('Error al cargar datos en EventRoute:', error);
      alert('Error al cargar datos de Rutas de Evento.');
    }
  }, [token]);

  // Cargar los datos al montar el componente
  useEffect(() => {
    load();
  }, [load]);

  // Función para agregar una ruta de evento
  const add = async () => {
    try {
      // Asegurarse de que los IDs sean números y la demanda sea un número
      const payload = {
        ...form,
        ruta_id: parseInt(form.ruta_id),
        evento_id: parseInt(form.evento_id),
        demanda_estimada: parseFloat(form.demanda_estimada), // Usar parseFloat para demanda
      };

      await createOne('event_routes', payload, token);
      // Reiniciar el formulario
      setForm({ ruta_id: '', evento_id: '', demanda_estimada: '' });
      load(); // Volver a cargar la lista para ver el nuevo elemento
      alert('Ruta de Evento creada exitosamente.');
    } catch (error) {
      console.error('Error al crear Ruta de Evento:', error.message);
      alert(`Error al crear Ruta de Evento: ${error.message}`);
    }
  };

  // Función para eliminar una ruta de evento
  const del = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta Ruta de Evento?')) {
      try {
        await deleteOne('event_routes', id, token);
        load(); // Recargar la lista después de eliminar
        alert('Ruta de Evento eliminada exitosamente.');
      } catch (error) {
        console.error('Error al eliminar Ruta de Evento:', error.message);
        alert(`Error al eliminar Ruta de Evento: ${error.message}`);
      }
    }
  };

  return (
    <div className="section">
      <h2>Rutas de Evento</h2>

      <table className="section__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ruta (Origen-Destino)</th>
            <th>Evento</th>
            <th>Demanda Estimada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map((er) => (
            <tr key={er.id}>
              <td>{er.id}</td>
              {/* Acceder a las propiedades anidadas de forma segura */}
              <td>
                {er.ruta && er.ruta.origen && er.ruta.destino
                  ? `${er.ruta.origen}-${er.ruta.destino}`
                  : 'N/A'}
              </td>
              <td>
                {er.evento && er.evento.nombre_evento
                  ? er.evento.nombre_evento
                  : 'N/A'}
              </td>
              <td>{er.demanda_estimada}</td>
              <td>
                <button className="section__delete" onClick={() => del(er.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Agregar Ruta de Evento</h3>
      <div className="section__form">
        {/* Dropdown para seleccionar la Ruta */}
        <select
          value={form.ruta_id}
          onChange={(e) => setForm({ ...form, ruta_id: e.target.value })}
        >
          <option value="">Seleccione una Ruta</option>
          {rutas.map((r) => (
            <option key={r.id} value={r.id}>
              {r.origen}-{r.destino}
            </option>
          ))}
        </select>

        {/* Dropdown para seleccionar el Evento */}
        <select
          value={form.evento_id}
          onChange={(e) => setForm({ ...form, evento_id: e.target.value })}
        >
          <option value="">Seleccione un Evento</option>
          {eventos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre_evento}
            </option>
          ))}
        </select>

        {/* Campo de entrada para la Demanda Estimada */}
        <input
          type="number" // Para asegurar que es un número
          placeholder="Demanda Estimada"
          value={form.demanda_estimada}
          onChange={(e) => setForm({ ...form, demanda_estimada: e.target.value })}
        />

        <button className="section__add" onClick={add}>
          Crear Ruta de Evento
        </button>
      </div>
    </div>
  );
}