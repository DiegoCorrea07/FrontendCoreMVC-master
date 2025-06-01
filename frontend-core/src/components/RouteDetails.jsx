import React from 'react';
import './RouteDetails.css';

export default function RouteDetails({ routeDetail, onBack }) { // Recibe routeDetail directamente y una función para volver
  if (!routeDetail) {
    return <div className="route-details-container">No hay detalles de ruta para mostrar.</div>;
  }

  // Helper para determinar la clase de color de la barra o estado
  const getCoverageColorClass = (coverage) => {
    if (coverage < 50) return 'red-coverage';
    if (coverage < 80) return 'yellow-coverage';
    return 'green-coverage';
  };

  return (
    <div className="section route-details-container">
      <button onClick={onBack} className="back-button">← Volver al Dashboard</button> {/* Botón para volver */}
      <div className="route-details-header">
        <h2>Detalle de Ruta</h2>
        <p className="breadcrumb">Dashboard &gt; {routeDetail.event_name} &gt; {routeDetail.route_name}</p>
      </div>

      <div className="route-info-cards">
        <div className="card">
          <p className={`route-status ${routeDetail.status.toLowerCase().replace(' ', '-')}`}>
            Ruta: {routeDetail.route_name} ({routeDetail.status})
          </p>
          <p>Evento: {routeDetail.event_name}</p>
          <p>Fechas: {new Date(routeDetail.event_start_date).toLocaleDateString()} – {new Date(routeDetail.event_end_date).toLocaleDateString()}</p>
        </div>
        <div className="card">
          <p>Demanda estimada: {routeDetail.demanda_estimada} Pasajeros</p>
          <p>Capacidad ofrecida: {routeDetail.capacidad_ofrecida} Pasajeros</p>
        </div>
      </div>

      <div className="coverage-section">
        <h3>Cobertura Actual: {routeDetail.porcentaje_cobertura}%</h3>
        <div className="bar-chart-container">
          {routeDetail.daily_coverage && routeDetail.daily_coverage.map((data, index) => (
            <div key={index} className="bar-column">
              <div
                className={`bar ${getCoverageColorClass(data.coverage)}`}
                style={{ height: `${data.coverage > 100 ? 100 : data.coverage}%` }} // Limita la altura al 100%
              ></div>
              <span className="bar-label">{data.day}</span>
              <span className="bar-value">{data.coverage}%</span> {/* Mostrar el valor de cobertura */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}