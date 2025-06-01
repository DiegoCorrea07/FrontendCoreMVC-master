import React, { useState, useEffect, useCallback } from 'react';
import { getAll, getOne } from '../services/api.js'; // Importar getOne para las rutas detalladas
import './CoverageDashboard.css';
import RouteDetails from './RouteDetails.jsx'; // Importa el nuevo componente RouteDetails

export default function CoverageDashboard({ token }) {
  const [dashboardData, setDashboardData] = useState([]);
  const [summaryMetrics, setSummaryMetrics] = useState({ cubiertas: 0, parciales: 0, criticas: 0 });
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Nuevos estados para controlar la vista de detalles de la ruta
  const [selectedRouteDetail, setSelectedRouteDetail] = useState(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [loading, setLoading] = useState(false); // Para mostrar carga al cambiar vistas
  const [error, setError] = useState(null); // Para manejar errores

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAll('events', token);
      setEvents(data.events || []);
      if (data.events && data.events.length > 0) {
        setSelectedEventId(data.events[0].id.toString()); // Asegurarse de que sea string si el select usa strings
      }
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      setError('Error al cargar eventos.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadDashboardData = useCallback(async () => {
    if (!selectedEventId) {
      setDashboardData([]);
      setSummaryMetrics({ cubiertas: 0, parciales: 0, criticas: 0 });
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      let url = `coverage/dashboard?event_id=${selectedEventId}&page=${currentPage}&limit=${itemsPerPage}`;
      if (statusFilter) {
        url += `&status_filter=${statusFilter}`; // Asegúrate que el parámetro sea 'status_filter' si así lo espera tu backend
      }
      const data = await getAll(url, token); // Sigue usando getAll para el dashboard ya que maneja parámetros de query
      setDashboardData(data.dashboard_data || []);
      setSummaryMetrics(data.summary_metrics || { cubiertas: 0, parciales: 0, criticas: 0 });
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      setError('Error al cargar datos del dashboard.');
      setDashboardData([]);
      setSummaryMetrics({ cubiertas: 0, parciales: 0, criticas: 0 });
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [token, selectedEventId, statusFilter, currentPage, itemsPerPage]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    // Solo cargar datos del dashboard si no estamos mostrando detalles de una ruta
    if (!showRouteDetails) {
      loadDashboardData();
    }
  }, [loadDashboardData, showRouteDetails]); // Añadir showRouteDetails a las dependencias

  const handleEventChange = (e) => {
    setSelectedEventId(e.target.value);
    setCurrentPage(1);
    setShowRouteDetails(false); // Volver al dashboard al cambiar de evento
    setSelectedRouteDetail(null); // Limpiar detalles
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
    setShowRouteDetails(false); // Volver al dashboard al cambiar el filtro
    setSelectedRouteDetail(null); // Limpiar detalles
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Cubierta': return 'status-covered';
      case 'Parcial': return 'status-partial';
      case 'Crítica': return 'status-critical';
      default: return '';
    }
  };

  // NUEVA FUNCIÓN: Manejar clic en una fila de la tabla para ver detalles
  const handleRouteClick = useCallback(async (rutaEventoId) => {
    setLoading(true);
    setError(null);
    try {
      // Usamos getOne porque estamos obteniendo un recurso específico por ID
      const details = await getOne(`coverage/route_detail/${rutaEventoId}`, token);
      setSelectedRouteDetail(details);
      setShowRouteDetails(true); // Mostrar la vista de detalles
    } catch (err) {
      console.error('Error al cargar detalles de la ruta:', err);
      setError('Error al cargar detalles de la ruta.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // NUEVA FUNCIÓN: Para volver al dashboard principal
  const handleBackToDashboard = useCallback(() => {
    setShowRouteDetails(false);
    setSelectedRouteDetail(null);
    loadDashboardData(); // Recargar el dashboard al volver
  }, [loadDashboardData]);


  if (loading) return <div className="section">Cargando...</div>;
  if (error) return <div className="section error-message">{error}</div>;

  return (
    <div className="section">
      {showRouteDetails ? (
        // Si showRouteDetails es true, renderiza el componente RouteDetails
        <RouteDetails routeDetail={selectedRouteDetail} onBack={handleBackToDashboard} />
      ) : (
        // De lo contrario, renderiza el dashboard principal
        <>
          <h2 className="section-title">Dashboard de Cobertura Operativa</h2>

          <div className="section__form">
            <label htmlFor="event-select">Evento:</label>
            <select id="event-select" value={selectedEventId} onChange={handleEventChange}>
              <option value="">-- Seleccione un Evento --</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.nombre_evento}
                </option>
              ))}
            </select>

            <label htmlFor="status-filter">Filtrar por estado:</label>
            <select id="status-filter" value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="">Todos</option>
              <option value="Cubierta">Cubierta</option>
              <option value="Parcial">Parcial</option>
              <option value="Crítica">Crítica</option>
            </select>
          </div>

          {selectedEventId && (
            <>
              <div className="summary-metrics-container">
                <div className="metric-card status-covered">
                  <h3>Rutas Cubiertas</h3>
                  <p>{summaryMetrics.cubiertas}%</p>
                </div>
                <div className="metric-card status-partial">
                  <h3>Rutas Parciales</h3>
                  <p>{summaryMetrics.parciales}%</p>
                </div>
                <div className="metric-card status-critical">
                  <h3>Rutas Críticas</h3>
                  <p>{summaryMetrics.criticas}%</p>
                </div>
              </div>

              <h3 className="table-title">Rutas del evento</h3>
              <table className="section__table">
                <thead>
                  <tr>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Demanda</th>
                    <th>Capacidad</th>
                    <th>% Cobertura</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.length > 0 ? (
                    dashboardData.map(item => (
                      <tr key={item.id} onClick={() => handleRouteClick(item.id)} className="clickable-row">
                        <td>{item.nombre_ruta.split('-')[0]}</td>
                        <td>{item.nombre_ruta.split('-')[1]}</td>
                        <td>{item.demanda_estimada}</td>
                        <td>{item.capacidad_real}</td>
                        <td>{item.porcentaje_cobertura}%</td>
                        <td>
                          <span className={`status-pill ${getStatusColorClass(item.estado_cobertura)}`}>
                            {item.estado_cobertura}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No hay datos de cobertura para el evento seleccionado o los filtros aplicados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {!selectedEventId && (
            <p>Por favor, seleccione un evento para ver el dashboard de cobertura.</p>
          )}
        </>
      )}
    </div>
  );
}