import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiFetch, { obtenerSesion } from '../api.js';

export default function AdminHorarios() {
  const navigate = useNavigate();

  const [bloques, setBloques] = useState([]);
  const [hora, setHora] = useState('');
  const [capacidad, setCapacidad] = useState('30');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuario = obtenerSesion();
    if (!usuario || usuario.rol !== 'Admin') {
      navigate('/login');
      return;
    }

    async function cargarBloques() {
      try {
        const data = await apiFetch('/horarios');
        setBloques(data);
      } catch (err) {
        console.error(err);
        alert(err.message || 'No se pudieron cargar los horarios.');
      } finally {
        setCargando(false);
      }
    }

    cargarBloques();
  }, [navigate]);

  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!hora) {
      alert('Selecciona una hora para el nuevo bloque.');
      return;
    }

    try {
      const nuevo = await apiFetch('/horarios', {
        method: 'POST',
        body: JSON.stringify({ hora, capacidad: parseInt(capacidad, 10) || 0 }),
      });
      setBloques((prev) => [...prev, nuevo].sort((a, b) => a.hora.localeCompare(b.hora)));
      setHora('');
      setCapacidad('30');
    } catch (err) {
      alert(err.message || 'No se pudo crear el bloque.');
    }
  };

  const handleToggle = async (bloque) => {
    try {
      const actualizado = await apiFetch(`/horarios/${bloque.id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ activo: !bloque.activo }),
      });
      setBloques((prev) => prev.map((b) => (b.id === bloque.id ? actualizado : b)));
    } catch (err) {
      alert(err.message || 'No se pudo cambiar el estado del bloque.');
    }
  };

  const handleCapacidad = async (id, valor) => {
    try {
      const actualizado = await apiFetch(`/horarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ capacidad: parseInt(valor, 10) || 0 }),
      });
      setBloques((prev) => prev.map((b) => (b.id === id ? actualizado : b)));
    } catch (err) {
      alert(err.message || 'No se pudo actualizar la capacidad.');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este bloque horario de forma permanente?')) return;

    try {
      await apiFetch(`/horarios/${id}`, { method: 'DELETE' });
      setBloques((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.message || 'No se pudo eliminar el bloque.');
    }
  };

  const handleRestaurar = async () => {
    if (!window.confirm('¿Restaurar los bloques horarios por defecto?')) return;

    try {
      const data = await apiFetch('/horarios/restaurar', { method: 'POST' });
      setBloques(data);
    } catch (err) {
      alert(err.message || 'No se pudieron restaurar los bloques.');
    }
  };

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
            SECCIÓN 01
          </span>
          <h2 className="text-3xl font-bold text-red-900">Gestión de Bloques Horarios</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl">
            Configura, modifica y añade los rangos de horas disponibles en los que los alumnos
            pueden agendar el recojo de sus almuerzos. Los bloques inactivos no se mostrarán al reservar.
          </p>
        </div>

        <form
          onSubmit={handleAgregar}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-end gap-4"
        >
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              Nueva Hora de Recojo
            </label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 transition-all bg-gray-50"
            />
          </div>
          <div className="w-full sm:w-40">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              Capacidad
            </label>
            <input
              type="number"
              min="0"
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 transition-all bg-gray-50"
            />
          </div>
          <button
            type="submit"
            className="bg-red-800 hover:bg-red-900 text-white py-2.5 px-6 rounded-xl font-medium transition shadow-md text-sm cursor-pointer whitespace-nowrap"
          >
            + Añadir Bloque
          </button>
        </form>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Hora</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Etiqueta</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Capacidad</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Estado</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cargando ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    Cargando horarios...
                  </td>
                </tr>
              ) : (
                bloques.map((b) => (
                  <tr key={b.id} className={b.activo ? '' : 'bg-slate-50/60 opacity-70'}>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{b.hora}</td>
                    <td className="px-6 py-4 text-slate-600">{b.etiqueta}</td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        value={b.capacidad}
                        onChange={(e) => handleCapacidad(b.id, e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md outline-none text-sm text-gray-800 focus:border-red-800 bg-gray-50"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 border rounded-md ${
                          b.activo
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-slate-100 text-slate-500 border-slate-300'
                        }`}
                      >
                        {b.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleToggle(b)}
                          className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-red-800 border border-slate-300 hover:border-red-300 rounded-md py-1.5 px-3 transition-colors cursor-pointer"
                        >
                          {b.activo ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => handleEliminar(b.id)}
                          className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-600 py-1.5 px-2 transition-colors cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!cargando && bloques.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No hay bloques horarios configurados. Añade uno con el formulario superior.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleRestaurar}
            className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-800 transition-colors cursor-pointer"
          >
            ↺ Restaurar bloques por defecto
          </button>
        </div>
      </main>
    </div>
  );
}
