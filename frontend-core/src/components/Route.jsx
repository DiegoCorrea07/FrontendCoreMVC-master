import React, { useState, useEffect, useCallback } from 'react';
// 1. Importamos la función updateOne de la API
import { getAll, createOne, updateOne, deleteOne } from '../services/api.js';
import Modal from './Modal';
import RouteForm from './RouteForm';
import './Styles.css';

export default function Route({ token }) {
  const [list, setList] = useState([]);

  // 2. Renombramos el estado para que sea más genérico
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 3. Nuevo estado para guardar la ruta que se está editando
  const [editingRoute, setEditingRoute] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await getAll('routes', token);
      setList(data.routes);
    } catch (error) {
      console.error('Error al cargar rutas:', error);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // 4. Funciones para manejar la apertura y cierre del modal
  const handleOpenAddModal = () => {
    setEditingRoute(null); // Limpiamos cualquier dato de edición
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (route) => {
    setEditingRoute(route); // Guardamos la ruta a editar
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoute(null);
  };


  // 5. La función handleSave ahora maneja tanto crear como actualizar
  const handleSave = async (formData) => {
    try {
      if (editingRoute) {
        // Si estamos editando, llamamos a updateOne
        await updateOne('routes', editingRoute.id, formData, token);
        alert('Ruta actualizada correctamente.');
      } else {
        // Si no, llamamos a createOne
        await createOne('routes', formData, token);
        alert('Ruta creada correctamente.');
      }
      load();
      handleCloseModal(); // Cierra el modal y resetea el estado
    } catch (error) {
      console.error('Error al guardar ruta:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const del = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta ruta?')) {
      await deleteOne('routes', id, token);
      load();
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Rutas</h2>
        <button className="section__add" onClick={handleOpenAddModal}>
          Agregar
        </button>
      </div>

      <table className="section__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Distancia (km)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.origen}</td>
              <td>{r.destino}</td>
              <td>{r.distancia}</td>
              <td>
                <div className="actions-group">
                  {/* 6. Añadimos el botón de Editar */}
                  <button className="section__edit" onClick={() => handleOpenEditModal(r)}>Editar</button>
                  <button className="section__delete" onClick={() => del(r.id)}>Eliminar</button>
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
        title={editingRoute ? 'Editar Ruta' : 'Agregar Nueva Ruta'}
      >
        <RouteForm
            onSave={handleSave}
            initialData={editingRoute}
        />
      </Modal>
    </div>
  );
}
