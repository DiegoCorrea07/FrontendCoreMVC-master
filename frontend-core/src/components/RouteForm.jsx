import React, { useState, useEffect } from 'react';
import './FormStyles.css'; // Reutilizamos los mismos estilos de formulario

const RouteForm = ({ onSave, initialData }) => {
  const [form, setForm] = useState({
    origen: '',
    destino: '',
    distancia: ''
  });

  // Este efecto se ejecuta cuando el componente se monta o cuando initialData cambia.
  useEffect(() => {
    if (initialData) {
      // Si recibimos datos iniciales, estamos editando.
      setForm(initialData);
    } else {
      // Si no, estamos creando, así que el formulario está vacío.
      setForm({
        origen: '',
        destino: '',
        distancia: ''
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
    const payload = {
        ...form,
        distancia: parseInt(form.distancia, 10)
    };
    if (isNaN(payload.distancia) || payload.distancia <= 0) {
        alert('La distancia debe ser un número positivo.');
        return;
    }
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="origen">Origen</label>
        <input
          id="origen"
          name="origen"
          type="text"
          placeholder="Ej: Quito"
          value={form.origen}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="destino">Destino</label>
        <input
          id="destino"
          name="destino"
          type="text"
          placeholder="Ej: Guayaquil"
          value={form.destino}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="distancia">Distancia (en km)</label>
        <input
          id="distancia"
          name="distancia"
          type="number"
          placeholder="Ej: 420"
          value={form.distancia}
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

export default RouteForm;
