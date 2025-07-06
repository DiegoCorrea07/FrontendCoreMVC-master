import React, { useState, useEffect } from 'react';
import './FormStyles.css';

const FlightForm = ({ onSave, initialData, eventRoutes, aeronaves }) => {
  // 1. El estado siempre se inicializa vacío.
  const [form, setForm] = useState({
    codigo_vuelo: '',
    fecha_salida: '',
    fecha_llegada: '',
    ruta_evento_id: '',
    aeronave_id: ''
  });

  // 2. Este useEffect es el corazón de la solución.
  // Se ejecuta CADA VEZ que el modal se abre o los datos cambian (`initialData`).
  useEffect(() => {
    // Solo rellenamos el formulario si tenemos los datos iniciales Y las listas de los desplegables.
    if (initialData && eventRoutes.length > 0 && aeronaves.length > 0) {
      console.log("Datos listos. Rellenando formulario con:", initialData);

      setForm({
        codigo_vuelo: initialData.codigo_vuelo || '',

        // Formateo de fechas para el input datetime-local
        fecha_salida: initialData.fecha_salida ? initialData.fecha_salida.slice(0, 16) : '',
        fecha_llegada: initialData.fecha_llegada ? initialData.fecha_llegada.slice(0, 16) : '',

        // --- LA CORRECCIÓN CLAVE ESTÁ AQUÍ ---
        // Leemos directamente de aeronave_id y ruta_evento_id
        ruta_evento_id: initialData.ruta_evento_id?.toString() || '',
        aeronave_id: initialData.aeronave_id?.toString() || '',
      });

    } else if (!initialData) {
      // Si no hay initialData (modo Agregar), reseteamos el formulario.
      setForm({
        codigo_vuelo: '',
        fecha_salida: '',
        fecha_llegada: '',
        ruta_evento_id: '',
        aeronave_id: ''
      });
    }
  }, [initialData, eventRoutes, aeronaves]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
        ...form,
        ruta_evento_id: parseInt(form.ruta_evento_id, 10),
        aeronave_id: parseInt(form.aeronave_id, 10)
    };
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="codigo_vuelo">Código de Vuelo</label>
        <input id="codigo_vuelo" name="codigo_vuelo" type="text" placeholder="Ej: LA1234" value={form.codigo_vuelo} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="fecha_salida">Fecha de Salida</label>
        <input id="fecha_salida" name="fecha_salida" type="datetime-local" value={form.fecha_salida} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="fecha_llegada">Fecha de Llegada</label>
        <input id="fecha_llegada" name="fecha_llegada" type="datetime-local" value={form.fecha_llegada} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="ruta_evento_id">Ruta de Evento</label>
        <select id="ruta_evento_id" name="ruta_evento_id" value={form.ruta_evento_id} onChange={handleChange} required>
          <option value="">Seleccione una Ruta de Evento</option>
          {eventRoutes.map(er => (
            <option key={er.id} value={er.id.toString()}>
              {`${er.ruta.origen}-${er.ruta.destino} (${er.evento.nombre_evento})`}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="aeronave_id">Aeronave</label>
        <select id="aeronave_id" name="aeronave_id" value={form.aeronave_id} onChange={handleChange} required>
          <option value="">Seleccione una Aeronave</option>
          {aeronaves.map(a => (
            <option key={a.id} value={a.id.toString()}>{a.matricula}</option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="form-submit-button">Guardar</button>
      </div>
    </form>
  );
};

export default FlightForm;
