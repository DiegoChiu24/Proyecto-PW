import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiFetch, { obtenerSesion } from '../api.js';

const ESTADO_INICIAL = {
  servicioSuspendido: false,
  fechas: [],
  usuarios: [],
};

export default function AdminBloqueos() {
  const navigate = useNavigate();

  const [data, setData] = useState(ESTADO_INICIAL);
  const [fecha, setFecha] = useState('');
  const [motivoFecha, setMotivoFecha] = useState('');
  const [usuario, setUsuario] = useState('');
  const [motivoUsuario, setMotivoUsuario] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuarioSesion = obtenerSesion();
    if (!usuarioSesion || usuarioSesion.rol !== 'Admin') {
      navigate('/login');
      return;
    }

    async function cargarDatos() {
      try {
        const [fechas, usuarios, servicio] = await Promise.all([
          apiFetch('/bloqueos/fechas'),
          apiFetch('/bloqueos/usuarios'),
          apiFetch('/servicio/estado'),
        ]);
        setData({ servicioSuspendido: servicio.servicioSuspendido, fechas, usuarios });
      } catch (err) {
        console.error(err);
        alert(err.message || 'No se pudieron cargar los bloqueos.');
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, [navigate]);

  const toggleServicio = async () => {
    try {
      const actualizado = await apiFetch('/servicio/estado', {
        method: 'PATCH',
        body: JSON.stringify({ servicioSuspendido: !data.servicioSuspendido }),
      });
      setData((prev) => ({ ...prev, servicioSuspendido: actualizado.servicioSuspendido }));
    } catch (err) {
      alert(err.message || 'No se pudo cambiar el estado del servicio.');
    }
  };

  const handleAgregarFecha = async (e) => {
    e.preventDefault();
    if (!fecha) {
      alert('Selecciona una fecha a bloquear.');
      return;
    }

    try {
      const nueva = await apiFetch('/bloqueos/fechas', {
        method: 'POST',
        body: JSON.stringify({ fecha, motivo: motivoFecha.trim() || 'Día no laborable' }),
      });
      setData((prev) => ({ ...prev, fechas: [...prev.fechas, nueva].sort((a, b) => a.fecha.localeCompare(b.fecha)) }));
      setFecha('');
      setMotivoFecha('');
    } catch (err) {
      alert(err.message || 'No se pudo bloquear la fecha.');
    }
  };

  const handleEliminarFecha = async (id) => {
    try {
      await apiFetch(`/bloqueos/fechas/${id}`, { method: 'DELETE' });
      setData((prev) => ({ ...prev, fechas: prev.fechas.filter((f) => f.id !== id) }));
    } catch (err) {
      alert(err.message || 'No se pudo desbloquear la fecha.');
    }
  };

  const handleAgregarUsuario = async (e) => {
    e.preventDefault();
    if (!usuario.trim()) {
      alert('Indica el correo o id del usuario a bloquear.');
      return;
    }

    try {
      const nuevo = await apiFetch('/bloqueos/usuarios', {
        method: 'POST',
        body: JSON.stringify({ correo: usuario.trim(), motivo: motivoUsuario.trim() || 'Incumplimiento de normas' }),
      });
      setData((prev) => ({ ...prev, usuarios: [...prev.usuarios, nuevo] }));
      setUsuario('');
      setMotivoUsuario('');
    } catch (err) {
      alert(err.message || 'No se pudo bloquear el usuario.');
    }
  };

  const handleEliminarUsuario = async (id) => {
    try {
      await apiFetch(`/bloqueos/usuarios/${id}`, { method: 'DELETE' });
      setData((prev) => ({ ...prev, usuarios: prev.usuarios.filter((u) => u.id !== id) }));
    } catch (err) {
      alert(err.message || 'No se pudo desbloquear el usuario.');
    }
  };

  const formatearFecha = (f) => f.split('-').reverse().join('/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-red-900 text-white">
        <header className="w-full border-b border-red-700">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-wide">Universidad del NOSE</h1>
            <Link
              to="/perfil/admin"
              className="text-sm font-medium border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-red-900 transition"
            >
              ← Volver al Panel
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 space-y-10">
        <div>
          <span className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3">
            SECCIÓN 02
          </span>
          <h2 className="text-3xl font-bold text-red-900">Control de Bloqueos / Inhabilitación</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl">
            Deshabilita fechas festivas, suspende el servicio temporalmente o bloquea usuarios que
            infrinjan las normas del comedor.
          </p>
        </div>

        <div
          className={`rounded-2xl p-6 shadow-sm border flex items-center justify-between gap-6 ${
            data.servicioSuspendido ? 'bg-red-50 border-red-300' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <h3 className="text-lg font-bold text-slate-800">Suspensión Temporal del Servicio</h3>
            <p className="text-slate-500 text-sm mt-1">
              {data.servicioSuspendido
                ? 'El servicio está SUSPENDIDO. Los alumnos no podrán generar nuevas reservas.'
                : 'El servicio está operativo. Los alumnos pueden reservar con normalidad.'}
            </p>
          </div>
          <button
            onClick={toggleServicio}
            className={`text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              data.servicioSuspendido
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-800 hover:bg-red-900 text-white'
            }`}
          >
            {data.servicioSuspendido ? 'Reactivar Servicio' : 'Suspender Servicio'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Fechas Inhabilitadas
            </h3>
            <form onSubmit={handleAgregarFecha} className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Motivo</label>
                <input
                  type="text"
                  value={motivoFecha}
                  onChange={(e) => setMotivoFecha(e.target.value)}
                  placeholder="Ej. Feriado nacional"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 bg-gray-50"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-50 hover:bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider py-2.5 border border-red-200 rounded-xl transition-colors cursor-pointer"
              >
                Bloquear Fecha
              </button>
            </form>

            <ul className="space-y-2">
              {cargando ? (
                <li className="text-center text-slate-400 text-sm py-4">Cargando fechas...</li>
              ) : (
                data.fechas.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-800 text-sm">{formatearFecha(f.fecha)}</span>
                      <span className="block text-xs text-slate-500">{f.motivo}</span>
                    </div>
                    <button
                      onClick={() => handleEliminarFecha(f.id)}
                      className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-600 cursor-pointer"
                    >
                      Quitar
                    </button>
                  </li>
                ))
              )}
              {!cargando && data.fechas.length === 0 && (
                <li className="text-center text-slate-400 text-sm py-4">No hay fechas bloqueadas.</li>
              )}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Usuarios Bloqueados
            </h3>
            <form onSubmit={handleAgregarUsuario} className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                  Correo o ID
                </label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Ej. juan.perez@uni.edu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Motivo</label>
                <input
                  type="text"
                  value={motivoUsuario}
                  onChange={(e) => setMotivoUsuario(e.target.value)}
                  placeholder="Ej. Reservas no recogidas reiteradas"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 bg-gray-50"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-50 hover:bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider py-2.5 border border-red-200 rounded-xl transition-colors cursor-pointer"
              >
                Bloquear Usuario
              </button>
            </form>

            <ul className="space-y-2">
              {cargando ? (
                <li className="text-center text-slate-400 text-sm py-4">Cargando usuarios...</li>
              ) : (
                data.usuarios.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5"
                  >
                    <div>
                      <span className="font-bold text-slate-800 text-sm">{u.nombres || u.correo || u.nombre}</span>
                      <span className="block text-xs text-slate-500">{u.motivoBloqueo || u.motivo}</span>
                    </div>
                    <button
                      onClick={() => handleEliminarUsuario(u.id)}
                      className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-green-600 cursor-pointer"
                    >
                      Desbloquear
                    </button>
                  </li>
                ))
              )}
              {!cargando && data.usuarios.length === 0 && (
                <li className="text-center text-slate-400 text-sm py-4">No hay usuarios bloqueados.</li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
