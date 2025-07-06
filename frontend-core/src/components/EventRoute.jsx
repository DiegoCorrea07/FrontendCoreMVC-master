import React, { useState, useEffect, useCallback } from 'react';
// 1. Importamos la función updateOne de la API
import { getAll, createOne, updateOne, deleteOne } from '../services/api.js';
import Modal from './Modal';
import EventRouteForm from './EventRouteForm';
import './Styles.css';

export default function EventRoute({ token }) {
  const [list, setList] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [eventos, setEventos] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // 2. Nuevo estado para guardar la ruta de evento que se está editando
  const [editingEventRoute, setEditingEventRoute] = useState(null);

  const load = useCallback(async () => {
    try {
      const [eventRoutesData, rutasData, eventosData] = await Promise.all([
        getAll('event_routes', token),
        getAll('routes', token),
        getAll('events', token)
      ]);
      setList(eventRoutesData.event_routes || []);
      setRutas(rutasData.routes || []);
      setEventos(eventosData.events || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos iniciales.');
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // 3. Funciones para manejar la apertura y cierre del modal
  const handleOpenAddModal = () => {
    setEditingEventRoute(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (eventRoute) => {
    setEditingEventRoute(eventRoute);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEventRoute(null);
  };

  // 4. La función handleSave ahora maneja tanto crear como actualizar
  const handleSave = async (formData) => {
    try {
      if (editingEventRoute) {
        await updateOne('event_routes', editingEventRoute.id, formData, token);
        alert('Ruta de Evento actualizada correctamente.');
      } else {
        await createOne('event_routes', formData, token);
        alert('Ruta de Evento creada correctamente.');
      }
      load();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar Ruta de Evento:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const del = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta Ruta de Evento?')) {
      await deleteOne('event_routes', id, token);
      load();
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Rutas de Evento</h2>
        <button className="section__add" onClick={handleOpenAddModal}>
          Agregar
        </button>
      </div>

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
              <td>{er.ruta ? `${er.ruta.origen}-${er.ruta.destino}` : 'N/A'}</td>
              <td>{er.evento ? er.evento.nombre_evento : 'N/A'}</td>
              <td>{er.demanda_estimada}</td>
              <td>
                <div className="actions-group">
                  {/* 5. Añadimos el botón de Editar */}
                  <button className="section__edit" onClick={() => handleOpenEditModal(er)}>Editar</button>
                  <button className="section__delete" onClick={() => del(er.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 6. El modal ahora es dinámico */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEventRoute ? 'Editar Ruta de Evento' : 'Agregar Nueva Ruta de Evento'}
      >
        <EventRouteForm
          onSave={handleSave}
          initialData={editingEventRoute}
          rutas={rutas}
          eventos={eventos}
        />
      </Modal>
    </div>
  );
}
