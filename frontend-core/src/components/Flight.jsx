import React, { useState, useEffect, useCallback } from 'react';
// 1. Importamos la función updateOne de la API
import { getAll, createOne, updateOne, deleteOne } from '../services/api.js';
import FlightManifest from './FlightManifest';
import Modal from './Modal';
import FlightForm from './FlightForm';
import './Styles.css';

export default function Flight({ token }) {
  const [list, setList] = useState([]);
  const [eventRoutes, setEventRoutes] = useState([]);
  const [aeronaves, setAeronaves] = useState([]);
  const [viewingManifestId, setViewingManifestId] = useState(null);

  // 2. Renombramos el estado para que sea más genérico
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 3. Nuevo estado para guardar el vuelo que se está editando
  const [editingFlight, setEditingFlight] = useState(null);

  const load = useCallback(async () => {
    try {
      // Optimizamos las llamadas a la API para que se ejecuten en paralelo
      const [flightsData, eventRoutesData, aeronavesData] = await Promise.all([
        getAll('flights', token),
        getAll('event_routes', token),
        getAll('aircrafts', token)
      ]);
      setList(flightsData.flights);
      setEventRoutes(eventRoutesData.event_routes);
      setAeronaves(aeronavesData.aircrafts);
    } catch (error) {
      console.error('Error al cargar datos en Flight:', error);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // 4. Funciones para manejar la apertura y cierre del modal
  const handleOpenAddModal = () => {
    setEditingFlight(null); // Nos aseguramos de que no haya datos de edición
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (flight) => {
    setEditingFlight(flight); // Guardamos el vuelo a editar
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFlight(null);
  };

  // 5. La función handleSave ahora maneja tanto crear como actualizar
  const handleSave = async (formData) => {
    try {
      if (editingFlight) {
        // Si estamos editando, llamamos a updateOne
        await updateOne('flights', editingFlight.id, formData, token);
        alert('Vuelo actualizado correctamente.');
      } else {
        // Si no, llamamos a createOne
        await createOne('flights', formData, token);
        alert('Vuelo creado correctamente.');
      }
      load();
      handleCloseModal(); // Cierra el modal y resetea el estado
    } catch (error) {
      console.error('Error al guardar vuelo:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const del = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este vuelo?')) {
      await deleteOne('flights', id, token);
      load();
    }
  };

  const handleViewManifest = (flightId) => {
    setViewingManifestId(flightId);
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Vuelos</h2>
        <button className="section__add" onClick={handleOpenAddModal}>
          Agregar
        </button>
      </div>

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
              <td>{f.id}</td><td>{f.codigo_vuelo}</td><td>{new Date(f.fecha_salida).toLocaleString()}</td><td>{new Date(f.fecha_llegada).toLocaleString()}</td><td>{f.ruta_evento ? `${f.ruta_evento.ruta.origen}-${f.ruta_evento.ruta.destino} (${f.ruta_evento.evento.nombre_evento})` : f.ruta_evento_id}</td><td>{f.aeronave ? f.aeronave.matricula : f.aeronave_id}</td>
              <td>
                <div className="actions-group">
                  <button className="section__view" onClick={() => handleViewManifest(f.id)}>Manifiesto</button>
                  {/* 6. Añadimos el botón de Editar */}
                  <button className="section__edit" onClick={() => handleOpenEditModal(f)}>Editar</button>
                  <button className="section__delete" onClick={() => del(f.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 7. El modal ahora es dinámico */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingFlight ? 'Editar Vuelo' : 'Agregar Nuevo Vuelo'}
      >
        <FlightForm
          onSave={handleSave}
          initialData={editingFlight}
          eventRoutes={eventRoutes}
          aeronaves={aeronaves}
        />
      </Modal>

      {viewingManifestId && (
        <FlightManifest
          flightId={viewingManifestId}
          onClose={() => setViewingManifestId(null)}
          token={token}
        />
      )}
    </div>
  );
}
