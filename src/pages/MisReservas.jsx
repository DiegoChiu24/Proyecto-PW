import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:5000/api/reservas';

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-user-id': localStorage.getItem('userId') || '',
  };
}

export default function MisReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionActive = localStorage.getItem('isLoggedIn') === 'true';
    if (!sessionActive) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/mias`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar tus reservas');
      
      // Formatear las reservas que vienen del mock / backend
      const formateadas = data.map(r => {
        let tipoEstado = 'success';
        if (r.estado === 'Pendiente') tipoEstado = 'warning';
        if (r.estado === 'Cancelada') tipoEstado = 'danger';

        // Intentar formatear la fecha a DD/MM/YYYY si viene en ISO (YYYY-MM-DD)
        let fechaFormateada = r.fecha;
        if (r.fecha && r.fecha.includes('-')) {
            fechaFormateada = r.fecha.split('-').reverse().join('/');
        }

        return {
          id: r.id,
          plato: r.platoNombre || 'Plato Desconocido',
          precio: r.precio ? `S/ ${Number(r.precio).toFixed(2)}` : 'S/ 0.00',
          fecha: fechaFormateada,
          hora: r.hora,
          estado: r.estado,
          tipoEstado,
          codigo: r.codigo || `TX-00${r.id}`
        };
      });

      setReservas(formateadas);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: err.message,
        confirmButtonColor: '#801414',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleCancelar = async (id) => {
    const result = await Swal.fire({
      title: '¿Cancelar esta reserva?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#801414',
      cancelButtonColor: '#64748b'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}/cancelar`, {
        method: 'PATCH',
        headers: authHeaders()
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Error al cancelar la reserva');

      // Actualización optimista
      setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: "Cancelada", tipoEstado: "danger" } : r));

      Swal.fire({
        icon: 'success',
        title: 'Reserva cancelada',
        text: 'La reserva ha sido cancelada exitosamente.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al cancelar',
        text: err.message,
        confirmButtonColor: '#801414',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-5 px-6 sm:px-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-red-900 tracking-tight misreservas-title">
            Mis Reservas
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1 misreservas-subtitle">
            Universidad del NOSE — Panel de Alumno
          </p>
        </div>
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center border-2 border-red-900 text-red-900 hover:bg-red-50 text-sm font-bold uppercase tracking-wider py-2 px-5 transition-colors duration-150 misreservas-back-link"
          >
            ← Regresar al Sistema
          </Link>
        </div>
      </div>

      <div className="flex flex-col">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
          </div>
        ) : (
          <>
            {reservas.map((reserva, index) => (
              <div 
                key={reserva.id} 
                className={`w-full bg-white px-6 sm:px-12 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${
                  index !== reservas.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 flex-1">
                  <div className="min-w-[120px]">
                    <span className="text-xs font-mono font-bold text-gray-400 block misreservas-codigo">
                      {reserva.codigo}
                    </span>
                    <span className="text-sm font-medium text-gray-600 block mt-0.5 misreservas-meta">
                      {reserva.fecha} — {reserva.hora}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 misreservas-plato">
                      {reserva.plato}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-3">
                      <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 border misreservas-status ${
                        reserva.tipoEstado === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                        reserva.tipoEstado === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {reserva.estado}
                      </span>
                    </div>
                  </div>

                  <div className="md:text-right min-w-[100px]">
                    <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider misreservas-total-label">
                      Total
                    </span>
                    <span className="text-2xl font-black text-red-900 block misreservas-price">
                      {reserva.precio}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-gray-100 pt-4 md:pt-0 md:border-0 justify-end">
                  <button 
                    onClick={() => Swal.fire({ title: 'Tu Código QR', text: reserva.codigo, icon: 'info', confirmButtonColor: '#801414' })}
                    className="bg-red-900 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider py-3 px-6 transition-colors duration-150 cursor-pointer misreservas-ticket-btn"
                  >
                    Ver Ticket / QR
                  </button>
                  {reserva.estado !== "Cancelada" && (
                    <button 
                      onClick={() => handleCancelar(reserva.id)}
                      className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-600 py-3 px-4 transition-colors duration-150 cursor-pointer misreservas-cancel-btn"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}

            {reservas.length === 0 && (
              <div className="w-full bg-white py-20 px-6 text-center border-b border-gray-200">
                <p className="text-gray-500 font-bold text-lg misreservas-empty-text">No registras reservas activas en este momento.</p>
                <Link to="/reservar" className="mt-4 inline-block bg-red-900 text-white text-xs font-bold uppercase tracking-wider py-3 px-6 misreservas-empty-link transition hover:bg-red-800">
                  Solicitar Reserva
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}