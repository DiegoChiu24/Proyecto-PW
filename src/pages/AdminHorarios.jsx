import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAuthHeaders } from '../api.js';

const API_URL = 'http://localhost:5000/api/horarios';

// Helper: headers con autenticación admin (x-user-id)
function authHeaders() {
  return getAuthHeaders();
}

export default function AdminHorarios() {
  const navigate = useNavigate();

  const [bloques, setBloques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hora, setHora] = useState('');
  const [capacidad, setCapacidad] = useState('30');
  const [submitting, setSubmitting] = useState(false);

  // --- Protección de ruta ---
  useEffect(() => {
    const sessionActive = localStorage.getItem('isLoggedIn') === 'true';
    if (!sessionActive) {
      navigate('/login');
    }
  }, [navigate]);

  // --- READ: cargar bloques del backend ---
  const fetchBloques = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar los horarios.');
      const data = await res.json();
      setBloques(data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: err.message || 'No se pudieron cargar los horarios.',
        confirmButtonColor: '#801414',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloques();
  }, []);

  // --- CREATE: añadir nuevo bloque ---
  const handleAgregar = async (e) => {
    e.preventDefault();

    if (!hora) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Selecciona una hora para el nuevo bloque.',
        confirmButtonColor: '#801414',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ hora, capacidad: parseInt(capacidad, 10) || 0 }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo crear',
          text: data.error || 'Error al crear el bloque horario.',
          confirmButtonColor: '#801414',
        });
        return;
      }

      // Insertar en el estado local manteniendo orden por hora
      setBloques((prev) => [...prev, data].sort((a, b) => a.hora.localeCompare(b.hora)));
      setHora('');
      setCapacidad('30');

      Swal.fire({
        icon: 'success',
        title: 'Bloque creado',
        text: `Se añadió el bloque de las ${data.etiqueta}.`,
        confirmButtonColor: '#801414',
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Sin conexión',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#801414',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // --- UPDATE: cambiar capacidad (PUT) ---
  const handleCapacidad = async (id, valor) => {
    const nuevaCapacidad = parseInt(valor, 10) || 0;

    // Actualización optimista en UI
    setBloques((prev) =>
      prev.map((b) => (b.id === id ? { ...b, capacidad: nuevaCapacidad } : b))
    );

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ capacidad: nuevaCapacidad }),
      });

      if (!res.ok) {
        const data = await res.json();
        // Revertir si falla — refetch
        await fetchBloques();
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: data.error || 'No se pudo actualizar la capacidad.',
          confirmButtonColor: '#801414',
        });
      }
    } catch (err) {
      await fetchBloques();
      Swal.fire({
        icon: 'error',
        title: 'Sin conexión',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#801414',
      });
    }
  };

  // --- UPDATE: activar/desactivar (PATCH) ---
  const handleToggle = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;

    // Actualización optimista
    setBloques((prev) =>
      prev.map((b) => (b.id === id ? { ...b, activo: nuevoEstado } : b))
    );

    try {
      const res = await fetch(`${API_URL}/${id}/estado`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ activo: nuevoEstado }),
      });

      if (!res.ok) {
        const data = await res.json();
        await fetchBloques();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'No se pudo cambiar el estado.',
          confirmButtonColor: '#801414',
        });
      }
    } catch (err) {
      await fetchBloques();
      Swal.fire({
        icon: 'error',
        title: 'Sin conexión',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#801414',
      });
    }
  };

  // --- DELETE: eliminar bloque ---
  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar bloque?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo eliminar',
          text: data.error || 'Error al eliminar el bloque.',
          confirmButtonColor: '#801414',
        });
        return;
      }

      // Remover del estado local
      setBloques((prev) => prev.filter((b) => b.id !== id));

      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El bloque horario fue eliminado.',
        confirmButtonColor: '#801414',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Sin conexión',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#801414',
      });
    }
  };

  // --- RESTAURAR: volver a bloques por defecto ---
  const handleRestaurar = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: '¿Restaurar bloques por defecto?',
      text: 'Se eliminarán todos los bloques actuales y se recrearán los predeterminados.',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#801414',
      cancelButtonColor: '#64748b',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/restaurar`, {
        method: 'POST',
        headers: authHeaders(),
      });

      if (!res.ok) {
        const data = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'No se pudieron restaurar los bloques.',
          confirmButtonColor: '#801414',
        });
        return;
      }

      const data = await res.json();
      setBloques(data);

      Swal.fire({
        icon: 'success',
        title: 'Restaurado',
        text: 'Los bloques horarios fueron restaurados a los valores por defecto.',
        confirmButtonColor: '#801414',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Sin conexión',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#801414',
      });
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

        {/* FORMULARIO DE ALTA */}
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
            disabled={submitting}
            className="bg-red-800 hover:bg-red-900 disabled:bg-red-400 disabled:cursor-not-allowed text-white py-2.5 px-6 rounded-xl font-medium transition shadow-md text-sm cursor-pointer whitespace-nowrap"
          >
            {submitting ? 'Añadiendo...' : '+ Añadir Bloque'}
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
              {loading ? (
                // Skeleton de carga
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32 ml-auto"></div></td>
                  </tr>
                ))
              ) : bloques.length > 0 ? (
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
                          onClick={() => handleToggle(b.id, b.activo)}
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
              ) : (
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
