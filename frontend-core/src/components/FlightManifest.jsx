import React, { useState, useEffect } from 'react';
import { getFlightManifest } from '../services/api';
import './FlightManifest.css';

const FlightManifest = ({ flightId, onClose, token }) => {
  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!flightId) return;

    const loadManifest = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFlightManifest(flightId, token);
        setManifest(data);
      } catch (err) {
        setError('No se pudo cargar el manifiesto.');
        console.error("Error al cargar el manifiesto:", err);
      } finally {
        setLoading(false);
      }
    };

    loadManifest();
  }, [flightId, token]);

  const renderContent = () => {
    if (loading) {

      return <div className="loading">Cargando Manifiesto...</div>;
    }
    if (error) {
      return <div className="error">{error}</div>;
    }
    if (!manifest) {
      return null;
    }

    return (
      <>
        <div className="section">
          <h3 className="section-title">Detalles del Vuelo</h3>
          <div className="grid">
            <div className="full-width-item">
              <span className="label">Código de Vuelo</span>
              <span className="value">{manifest.vuelo.codigo}</span>
            </div>
            <div className="info-item">
              <span className="label">Origen</span>
              <span className="value">{manifest.ruta.origen}</span>
            </div>
            <div className="info-item">
              <span className="label">Destino</span>
              <span className="value">{manifest.ruta.destino}</span>
            </div>
            <div className="info-item">
              <span className="label">Salida</span>
              <span className="value">{new Date(manifest.vuelo.fecha_salida).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Llegada</span>
              <span className="value">{new Date(manifest.vuelo.fecha_llegada).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3 className="section-title">Información Operativa</h3>
          <div className="grid">
            <div className="info-item">
              <span className="label">Aeronave</span>
              <span className="value">{manifest.aeronave.modelo} ({manifest.aeronave.matricula})</span>
            </div>
            <div className="info-item">
              <span className="label">Evento Asociado</span>
              <span className="value">{manifest.evento.nombre}</span>
            </div>
            <div className="info-item">
              <span className="label">Capacidad Máxima</span>
              <span className="value">{manifest.aeronave.capacidad_maxima}</span>
            </div>
            <div className="info-item">
              <span className="label">Asientos Disponibles</span>
              <span className="value">{manifest.manifiesto_vuelo.asientos_disponibles}</span>
            </div>
            <div className="info-item">
              <span className="label">Demanda de Ruta</span>
              <span className="value">{manifest.cobertura_ruta.demanda_estimada}</span>
            </div>
            <div className="info-item">
              <span className="label">Estado de Cobertura</span>
              <span className="value">{manifest.cobertura_ruta.estado_general}</span>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <h2 className="title">Manifiesto de Vuelo</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default FlightManifest;