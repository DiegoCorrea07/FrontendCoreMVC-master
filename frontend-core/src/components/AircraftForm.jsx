import React, { useState } from 'react';
import './FormStyles.css'; // Reutilizamos los mismos estilos de formulario

const AircraftForm = ({ onSave, initialData }) => {
  const [form, setForm] = useState(initialData || {
    matricula: '',
    modelo: '',
    capacidad: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validamos que la capacidad sea un número
    const payload = {
        ...form,
        capacidad: parseInt(form.capacidad, 10)
    };
    if (isNaN(payload.capacidad)) {
        alert('La capacidad debe ser un número válido.');
        return;
    }
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="matricula">Matrícula</label>
        <input
          id="matricula"
          name="matricula"
          type="text"
          placeholder="Ej: HC-CPT"
          value={form.matricula}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="modelo">Modelo</label>
        <input
          id="modelo"
          name="modelo"
          type="text"
          placeholder="Ej: Airbus A320"
          value={form.modelo}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="capacidad">Capacidad</label>
        <input
          id="capacidad"
          name="capacidad"
          type="number"
          placeholder="Ej: 180"
          value={form.capacidad}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="form-submit-button">Guardar</button>
      </div>
    </form>
  );
};

export default AircraftForm;
