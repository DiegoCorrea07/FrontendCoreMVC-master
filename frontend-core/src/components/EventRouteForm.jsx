import React, { useState, useEffect } from 'react';
import './FormStyles.css';

const EventRouteForm = ({ onSave, initialData, rutas, eventos }) => {
  // 1. El estado del formulario se mantiene igual
  const [form, setForm] = useState({
    ruta_id: '',
    evento_id: '',
    demanda_estimada: '',
  });

  // El estado para las rutas filtradas también se mantiene
  const [rutasFiltradas, setRutasFiltradas] = useState([]);

  // Se ejecuta solo una vez cuando llega `initialData`.
  useEffect(() => {
    if (initialData) {
      setForm({
        ruta_id: initialData.ruta_id?.toString() || '',
        evento_id: initialData.evento_id?.toString() || '',
        demanda_estimada: initialData.demanda_estimada?.toString() || '',
      });
    }
  }, [initialData]); // Depende solo de initialData

  // Se ejecuta cuando el evento cambia o cuando los datos maestros (rutas, eventos) cargan.
  useEffect(() => {
    // Si no hay evento seleccionado o no han cargado las rutas/eventos, la lista está vacía.
    if (!form.evento_id || !rutas.length || !eventos.length) {
      setRutasFiltradas([]);
      return;
    }

    // Filtra las rutas basándose en el evento seleccionado en el formulario
    const eventoSeleccionado = eventos.find(e => e.id.toString() === form.evento_id);
    let rutasParaMostrar = [];

    if (eventoSeleccionado?.ciudad_evento) {
      rutasParaMostrar = rutas.filter(ruta =>
        ruta.destino?.toLowerCase() === eventoSeleccionado.ciudad_evento.toLowerCase()
      );
    }

    // nos aseguramos de que la ruta inicial siempre esté en la lista para poder ser seleccionada.
    if (initialData?.ruta_id) {
      const rutaInicialId = initialData.ruta_id.toString();
      const rutaInicialYaExiste = rutasParaMostrar.some(r => r.id.toString() === rutaInicialId);

      // Si no existe, la buscamos en la lista completa y la añadimos al principio
      if (!rutaInicialYaExiste) {
        const rutaInicialObj = rutas.find(r => r.id.toString() === rutaInicialId);
        if (rutaInicialObj) {
          rutasParaMostrar.unshift(rutaInicialObj);
        }
      }
    }

    setRutasFiltradas(rutasParaMostrar);

  }, [form.evento_id, initialData, rutas, eventos]); // Depende de estos valores para re-calcularse


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el usuario cambia el evento, reseteamos la ruta seleccionada.
    // El useEffect de arriba se encargará de actualizar la lista de opciones.
    if (name === 'evento_id') {
      setForm(prevForm => ({ ...prevForm, evento_id: value, ruta_id: '' }));
    } else {
      setForm(prevForm => ({ ...prevForm, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      ruta_id: parseInt(form.ruta_id, 10),
      evento_id: parseInt(form.evento_id, 10),
      demanda_estimada: parseFloat(form.demanda_estimada),
    };
    if (!payload.ruta_id || !payload.evento_id || isNaN(payload.demanda_estimada)) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
       <div className="form-group">
        <label htmlFor="evento_id">Evento</label>
        <select id="evento_id" name="evento_id" value={form.evento_id} onChange={handleChange} required>
          <option value="">Seleccione un Evento</option>
          {eventos.map((e) => (
            <option key={e.id} value={e.id.toString()}>
              {`${e.nombre_evento} (${e.ciudad_evento})`}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="ruta_id">Ruta</label>
        <select id="ruta_id" name="ruta_id" value={form.ruta_id} onChange={handleChange} disabled={!form.evento_id} required>
          <option value="">Seleccione una Ruta</option>
          {rutasFiltradas.map((r) => (
            <option key={r.id} value={r.id.toString()}>
              {r.origen}-{r.destino}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="demanda_estimada">Demanda Estimada</label>
        <input id="demanda_estimada" name="demanda_estimada" type="number" value={form.demanda_estimada} onChange={handleChange} required />
      </div>
      <div className="form-actions">
        <button type="submit" className="form-submit-button">Guardar</button>
      </div>
    </form>
  );
};

export default EventRouteForm;