import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiFetch, { obtenerSesion } from '../api.js';

export default function reservar() {
  const navigate = useNavigate();
  const [platoSeleccionado, setPlatoSeleccionado] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const [platos, setPlatos] = useState([]);
  const [menuDia, setMenuDia] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [servicioSuspendido, setServicioSuspendido] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuario = obtenerSesion();
    if (!usuario) {
      alert('Debes registrarte o iniciar sesión para poder realizar una reserva.');
      navigate('/login');
      return;
    }

    async function loadInitial() {
      try {
        const [pList, hList, sStatus] = await Promise.all([
          apiFetch('/platos'),
          apiFetch('/horarios?soloActivos=true'),
          apiFetch('/servicio/estado'),
        ]);
        setPlatos(pList.filter((p) => p.tipo !== 'Menú'));
        setHorarios(hList);
        setServicioSuspendido(sStatus.servicioSuspendido);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }

    loadInitial();
  }, [navigate]);

  useEffect(() => {
    async function loadMenu() {
      if (!fecha) {
        setMenuDia(null);
        return;
      }
      try {
        const m = await apiFetch(`/menu-dia?fecha=${fecha}`);
        setMenuDia(m);
      } catch (err) {
        setMenuDia(null);
      }
    }
    loadMenu();
  }, [fecha]);

  const handleProcederReserva = async (e) => {
    e.preventDefault();

    if (!platoSeleccionado || !fecha || !hora) {
      alert('Por favor, completa todos los campos para tu reserva.');
      return;
    }

    if (servicioSuspendido) {
      alert('El servicio está suspendido temporalmente. No se pueden realizar reservas.');
      return;
    }

    try {
      const res = await apiFetch('/reservas', {
        method: 'POST',
        body: JSON.stringify({
          platoId: Number(platoSeleccionado),
          fecha,
          hora,
        }),
      });

      navigate('/misreservas', {
        state: {
          reservaCompletada: true,
          idTransaccion: res.codigo,
          nombrePlato: res.platoNombre,
          precioPlato: `S/ ${Number(res.precio).toFixed(2)}`,
          fecha: res.fecha,
          hora: res.hora,
        },
      });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al procesar la reserva.');
    }
  };

  const platosSeleccionables = [...platos];
  if (menuDia) {
    platosSeleccionables.push({
      id: 9999,
      nombre: `Menú del Día (${menuDia.platoPrincipal} + ${menuDia.entrada} + ${menuDia.bebida})`,
      precio: menuDia.precio,
      tipo: 'Menú',
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-red-900 text-white">
        <header className="w-full border-b border-red-700">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-wide">Universidad del NOSE</h1>
            <div>
              <Link to="/" className="text-sm font-medium border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-red-900 transition">
                ← Volver al Home
              </Link>
            </div>
          </div>
        </header>

        <main className="flex flex-col items-center px-6 py-12 text-center">
          <h2 className="text-4xl font-light tracking-tight">Solicitar Nueva Reserva</h2>
          <p className="mt-2 text-sm text-red-200 uppercase tracking-wider font-semibold">
            Paso único — Elige tu plato y horario
          </p>
        </main>
      </div>

      <section className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2 reserva-title">
              1. Selecciona tu Almuerzo
            </h3>
            <div className="space-y-3">
              {cargando ? (
                <p className="text-sm text-gray-500">Cargando opciones...</p>
              ) : (
                platosSeleccionables.map((plato) => (
                  <label
                    key={plato.id}
                    className={`reserva-plato-card border flex items-center justify-between p-4 rounded-xl cursor-pointer transition shadow-sm ${
                      platoSeleccionado === String(plato.id)
                        ? 'reserva-plato-card-selected border-red-800 bg-red-50/50 ring-1 ring-red-800'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plato"
                        value={plato.id}
                        checked={platoSeleccionado === String(plato.id)}
                        onChange={(e) => setPlatoSeleccionado(e.target.value)}
                        className="accent-red-800 w-4 h-4"
                      />
                      <div>
                        <span className="font-medium text-gray-900 reserva-plato-nombre block">{plato.nombre}</span>
                        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider reserva-plato-tipo">
                          {plato.tipo || 'Carta'}
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-red-800 reserva-plato-precio">S/ {Number(plato.precio).toFixed(2)}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleProcederReserva} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
              2. Horario y Entrega
            </h3>

            <div className="space-y-4 grow">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                  Fecha del Almuerzo
                </label>
                <input
                  type="date"
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 transition-all bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                  Hora de Recojo
                </label>
                <select
                  required
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 transition-all bg-gray-50"
                >
                  <option value="">Selecciona una hora...</option>
                  {horarios.map((h) => (
                    <option key={h.id} value={h.hora}>{h.etiqueta}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-xl font-medium transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Confirmar Reserva →
              </button>
              <p className="text-[11px] text-center text-gray-400 mt-3 leading-normal">
                Al confirmar, se generará tu código de ticket correspondiente automáticamente.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}