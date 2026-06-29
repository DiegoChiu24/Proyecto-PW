import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Button from '../components/Button.jsx';

const RESERVAS_INICIALES = [
  {
    id: 1,
    plato: "Lomo Saltado",
    precio: "S/ 20.00",
    fecha: "02/06/2026",
    hora: "13:15",
    estado: "Confirmada",
    tipoEstado: "success",
    idTransaccion: "inicial-1"
  },
  {
    id: 2,
    plato: "Ají de Gallina",
    precio: "S/ 15.00",
    fecha: "04/06/2026",
    hora: "12:45",
    estado: "Pendiente",
    tipoEstado: "warning",
    idTransaccion: "inicial-2"
  }
];

export default function MisReservas() {
  const location = useLocation();
  const navigate = useNavigate();

  const [reservas, setReservas] = useState(() => {
    const guardadas = localStorage.getItem('mis_reservas_comedor');
    let listaActual = guardadas ? JSON.parse(guardadas) : RESERVAS_INICIALES;

    if (location.state?.reservaCompletada && location.state?.idTransaccion) {
      const { nombrePlato, precioPlato, fecha, hora, idTransaccion } = location.state;
      const transaccionDuplicada = listaActual.some(r => r.idTransaccion === idTransaccion);

      if (!transaccionDuplicada) {
        const nuevaReserva = {
          id: listaActual.length > 0 ? Math.max(...listaActual.map(r => r.id)) + 1 : 1,
          plato: nombrePlato,
          precio: precioPlato,
          fecha: fecha.split('-').reverse().join('/'),
          hora: hora,
          estado: "Confirmada",
          tipoEstado: "success",
          idTransaccion: idTransaccion
        };

        listaActual = [nuevaReserva, ...listaActual];
        localStorage.setItem('mis_reservas_comedor', JSON.stringify(listaActual));
      }
    }

    return listaActual;
  });

  useEffect(() => {
    if (location.state?.reservaCompletada) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleCancelar = (id) => {
    const listaActualizada = reservas.map(reserva => {
      if (reserva.id === id) {
        return { ...reserva, estado: "Cancelada", tipoEstado: "danger" };
      }
      return reserva;
    });
    setReservas(listaActualizada);
    localStorage.setItem('mis_reservas_comedor', JSON.stringify(listaActualizada));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header backLink="/" backText="← Regresar al Sistema" variant="white" />

      <div className="flex flex-col">
        {reservas.map((reserva, index) => (
          <div 
            key={reserva.id} 
            className={`w-full bg-white px-6 sm:px-12 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${
              index !== reservas.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 flex-1">
              <div className="min-w-[120px]">
                <span className="text-xs font-mono font-bold text-gray-400 block">
                  CÓDIGO #00{reserva.id}
                </span>
                <span className="text-sm font-medium text-gray-600 block mt-0.5">
                  {reserva.fecha} — {reserva.hora}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {reserva.plato}
                </h3>
                <div className="mt-1.5 flex items-center gap-3">
                  <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 border ${
                    reserva.tipoEstado === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                    reserva.tipoEstado === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {reserva.estado}
                  </span>
                </div>
              </div>

              <div className="md:text-right min-w-[100px]">
                <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">
                  Total
                </span>
                <span className="text-2xl font-black text-red-900 block">
                  {reserva.precio}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-gray-100 pt-4 md:pt-0 md:border-0 justify-end">
              <Button 
                onClick={() => alert(`Ticket QR Código #00${reserva.id} listo para escaneo.`)}
                variant="primary"
                className="text-xs uppercase tracking-wider py-3 px-6 !rounded-none"
              >
                Ver Ticket / QR
              </Button>
              {reserva.estado !== "Cancelada" && (
                <Button 
                  onClick={() => handleCancelar(reserva.id)}
                  variant="text"
                  className="text-xs uppercase tracking-wider py-3 px-4"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        ))}

        {reservas.length === 0 && (
          <div className="w-full bg-white py-20 px-6 text-center border-b border-gray-200">
            <p className="text-gray-500 font-bold text-lg">No registras reservas activas en este momento.</p>
            <Link to="/reservar" className="mt-4 inline-block bg-red-900 text-white text-xs font-bold uppercase tracking-wider py-3 px-6">
              Solicitar Reserva
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}