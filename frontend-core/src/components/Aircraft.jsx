import React, { useState, useEffect, useCallback } from 'react';
import { getAll, createOne, updateOne, deleteOne } from '../services/api.js';
import Modal from './Modal';
import AircraftForm from './AircraftForm';
import './Styles.css';

export default function Aircraft({ token }) {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await getAll('aircrafts', token);
      setList(data.aircrafts);
    } catch (error) {
      console.error('Error al cargar aeronaves:', error);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleOpenAddModal = () => {
    setEditingAircraft(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (aircraft) => {
    setEditingAircraft(aircraft);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAircraft(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editingAircraft) {
        await updateOne('aircrafts', editingAircraft.id, formData, token);
        alert('Aeronave actualizada correctamente.');
      } else {
        await createOne('aircrafts', formData, token);
        alert('Aeronave creada correctamente.');
      }
      load();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar aeronave:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const del = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      await deleteOne('aircrafts', id, token);
      load();
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Aeronaves</h2>
        <button className="section__add" onClick={handleOpenAddModal}>
          Agregar
        </button>
      </div>

      <table className="section__table">
        <thead>
          <tr>
            <th>ID</th><th>Matrícula</th><th>Modelo</th><th>Capacidad</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td><td>{a.matricula}</td><td>{a.modelo}</td><td>{a.capacidad}</td>
              <td>
                <div className="actions-group">
                  <button className="section__edit" onClick={() => handleOpenEditModal(a)}>Editar</button>
                  <button className="section__delete" onClick={() => del(a.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAircraft ? 'Editar Aeronave' : 'Agregar Nueva Aeronave'}
      >
        <AircraftForm onSave={handleSave} initialData={editingAircraft} />
      </Modal>
    </div>
  );
}
