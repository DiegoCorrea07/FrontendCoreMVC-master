import React, { useState, useEffect } from 'react';
import './FormStyles.css'; // Reutilizamos los mismos estilos de formulario

const EventForm = ({ onSave, initialData }) => {
  const [form, setForm] = useState({
    codigo_evento: '',
    nombre_evento: '',
    descripcion: '',
    ciudad_evento: '',
    fecha_inicio: '',
    fecha_fin: ''
  });

  // Cuando initialData cambia (al abrir el modal para editar),
  // actualizamos el estado del formulario.
  useEffect(() => {
    if (initialData) {
      setForm({
        codigo_evento: initialData.codigo_evento || '',
        nombre_evento: initialData.nombre_evento || '',
        descripcion: initialData.descripcion || '',
        ciudad_evento: initialData.ciudad_evento || '',
        // Formateamos las fechas para que el input tipo 'date' las reconozca
        fecha_inicio: initialData.fecha_inicio ? initialData.fecha_inicio.split('T')[0] : '',
        fecha_fin: initialData.fecha_fin ? initialData.fecha_fin.split('T')[0] : ''
      });
    } else {
      // Si no hay datos iniciales, es un formulario de creación, lo reseteamos.
      setForm({
        codigo_evento: '',
        nombre_evento: '',
        descripcion: '',
        ciudad_evento: '',
        fecha_inicio: '',
        fecha_fin: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(form.fecha_inicio) > new Date(form.fecha_fin)) {
        alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
        return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="codigo_evento">Código del Evento</label>
        <input id="codigo_evento" name="codigo_evento" type="text" value={form.codigo_evento} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="nombre_evento">Nombre del Evento</label>
        <input id="nombre_evento" name="nombre_evento" type="text" value={form.nombre_evento} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <input id="descripcion" name="descripcion" type="text" value={form.descripcion} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="ciudad_evento">Ciudad del Evento</label>
        <input id="ciudad_evento" name="ciudad_evento" type="text" value={form.ciudad_evento} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="fecha_inicio">Fecha de Inicio</label>
        <input id="fecha_inicio" name="fecha_inicio" type="date" value={form.fecha_inicio} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="fecha_fin">Fecha de Fin</label>
        <input id="fecha_fin" name="fecha_fin" type="date" value={form.fecha_fin} onChange={handleChange} required />
      </div>
      <div className="form-actions">
        <button type="submit" className="form-submit-button">Guardar</button>
      </div>
    </form>
  );
};

export default EventForm;
