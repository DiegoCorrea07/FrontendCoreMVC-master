import React, { useState, useEffect, useCallback } from 'react';
import { getAll, createOne, updateOne, deleteOne } from '../services/api.js';
import Modal from './Modal'; // Importamos el modal genérico
import EventForm from './EventForm'; // Importamos el nuevo formulario
import './Styles.css'; // Tus estilos generales

export default function Event({ token }) {
  const [list, setList] = useState([]);

  // Estado para controlar si el modal está abierto o cerrado
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para guardar el evento que se está editando. Si es null, estamos creando uno nuevo.
  const [editingEvent, setEditingEvent] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await getAll('events', token);
      setList(data.events);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // Función para abrir el modal en modo "Agregar"
  const handleOpenAddModal = () => {
    setEditingEvent(null); // Nos aseguramos de que no haya datos de edición
    setIsModalOpen(true);
  };

  // Función para abrir el modal en modo "Editar"
  const handleOpenEditModal = (event) => {
    setEditingEvent(event); // Guardamos el evento a editar
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  // Función que se pasa al formulario para guardar los datos
  const handleSave = async (formData) => {
    try {
      if (editingEvent) {
        // Si estamos editando, llamamos a updateOne
        await updateOne('events', editingEvent.id, formData, token);
        alert('Evento actualizado correctamente.');
      } else {
        // Si no, llamamos a createOne
        await createOne('events', formData, token);
        alert('Evento creado correctamente.');
      }
      load();
      handleCloseModal(); // Cierra el modal después de guardar
    } catch (error) {
      console.error('Error al guardar evento:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const del = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      await deleteOne('events', id, token);
      load();
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Eventos</h2>
        <button className="section__add" onClick={handleOpenAddModal}>
          Agregar
        </button>
      </div>

      <table className="section__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Ciudad</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.codigo_evento}</td>
              <td>{e.nombre_evento}</td>
              <td>{e.descripcion}</td>
              <td>{e.ciudad_evento}</td>
              <td>{e.fecha_inicio}</td>
              <td>{e.fecha_fin}</td>
              <td>
                <div className="actions-group">
                  <button className="section__edit" onClick={() => handleOpenEditModal(e)}>Editar</button>
                  <button className="section__delete" onClick={() => del(e.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Renderizado del Modal para AGREGAR o EDITAR */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvent ? 'Editar Evento' : 'Agregar Nuevo Evento'}
      >
        <EventForm
          onSave={handleSave}
          initialData={editingEvent}
        />
      </Modal>
    </div>
  );
}
