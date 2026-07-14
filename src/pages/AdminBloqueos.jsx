import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAuthHeaders } from '../api.js';

const API_URL = 'https://proyecto-pw-ziku.onrender.com/api/bloqueos';
const STORAGE_KEY = 'bloqueos_servicio';

function authHeaders() {
  return getAuthHeaders();
}

export default function AdminBloqueos() {
  const navigate = useNavigate();

  // Estado para fechas y usuarios desde la API
  const [fechas, setFechas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para la suspensión del servicio (local, ya que no hay endpoint para esto en el backend mockeado)
  const [servicioSuspendido, setServicioSuspendido] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const [fecha, setFecha] = useState('');
  const [motivoFecha, setMotivoFecha] = useState('');
  const [usuarioStr, setUsuarioStr] = useState(''); // correo o id
  const [motivoUsuario, setMotivoUsuario] = useState('');

  // Protección de ruta
  useEffect(() => {
    const sessionActive = localStorage.getItem('isLoggedIn') === 'true';
    if (!sessionActive) {
      navigate('/login');
    }
  }, [navigate]);

  // READ: Cargar bloqueos
  const fetchDatos = async () => {
    setLoading(true);
    try {
      const resFechas = await fetch(`${API_URL}/fechas`, { headers: authHeaders() });
      const resUsuarios = await fetch(`${API_URL}/usuarios`, { headers: authHeaders() });

      if (resFechas.ok && resUsuarios.ok) {
        setFechas(await resFechas.json());
        setUsuarios(await resUsuarios.json());
      } else {
        throw new Error('Error al obtener datos');
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los datos de bloqueos.', confirmButtonColor: '#801414' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const toggleServicio = () => {
    const nuevoEstado = !servicioSuspendido;
    setServicioSuspendido(nuevoEstado);
    localStorage.setItem(STORAGE_KEY, nuevoEstado.toString());
  };

  // CREATE FECHA
  const handleAgregarFecha = async (e) => {
    e.preventDefault();
    if (!fecha) {
      Swal.fire({ icon: 'warning', title: 'Atención', text: 'Selecciona una fecha a bloquear.', confirmButtonColor: '#801414' });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/fechas`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ fecha, motivo: motivoFecha }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al bloquear fecha');

      // Actualizar estado simulando el retorno (el mock devuelve el objeto creado o lo hacemos con refetch)
      // Como el mock devuelve "Operación simulada con éxito" y los datos, usamos lo que devuelve o recargamos:
      await fetchDatos(); // Recargamos para reflejar el estado si el backend mock lo permitiera, pero como es estático:
      // Para efectos de UX, lo inyectamos al estado directamente si el mock no guarda en memoria:
      if (data.mensaje) {
         setFechas(prev => [...prev, { id: data.id || Date.now(), fecha, motivo: motivoFecha.trim() || 'Día no laborable' }].sort((a, b) => a.fecha.localeCompare(b.fecha)));
      }

      setFecha('');
      setMotivoFecha('');
      Swal.fire({ icon: 'success', title: 'Fecha bloqueada', text: data.mensaje || 'Se bloqueó la fecha.', confirmButtonColor: '#801414', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#801414' });
    }
  };

  // DELETE FECHA
  const handleEliminarFecha = async (id) => {
    const result = await Swal.fire({
      title: '¿Desbloquear fecha?', text: 'Esta fecha volverá a estar disponible.', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Sí', cancelButtonText: 'Cancelar', confirmButtonColor: '#801414', cancelButtonColor: '#64748b'
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/fechas/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al desbloquear');

      setFechas(prev => prev.filter(f => f.id !== id));
      Swal.fire({ icon: 'success', title: 'Desbloqueado', text: data.mensaje, timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#801414' });
    }
  };

  // CREATE USUARIO (Bloquear)
  const handleAgregarUsuario = async (e) => {
    e.preventDefault();
    if (!usuarioStr.trim()) {
      Swal.fire({ icon: 'warning', title: 'Atención', text: 'Indica el nombre o correo del usuario a bloquear.', confirmButtonColor: '#801414' });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ correo: usuarioStr.trim(), motivo: motivoUsuario }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al bloquear usuario');

      setUsuarios(prev => [...prev, {
        id: data.id || Date.now(),
        nombres: usuarioStr.trim(),
        apellidos: "",
        correo: data.correo || usuarioStr.trim(),
        motivoBloqueo: motivoUsuario.trim() || 'Incumplimiento de normas'
      }]);

      setUsuarioStr('');
      setMotivoUsuario('');
      Swal.fire({ icon: 'success', title: 'Usuario bloqueado', text: data.mensaje, confirmButtonColor: '#801414', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#801414' });
    }
  };

  // DELETE USUARIO (Desbloquear)
  const handleEliminarUsuario = async (id) => {
    const result = await Swal.fire({
      title: '¿Desbloquear usuario?', text: 'El usuario podrá volver a reservar.', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Sí', cancelButtonText: 'Cancelar', confirmButtonColor: '#801414', cancelButtonColor: '#64748b'
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al desbloquear');

      setUsuarios(prev => prev.filter(u => u.id !== id));
      Swal.fire({ icon: 'success', title: 'Desbloqueado', text: data.mensaje, timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#801414' });
    }
  };

  const formatearFecha = (f) => f ? f.split('-').reverse().join('/') : '';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-red-900 text-white">
        <header className="w-full border-b border-red-700">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-wide">Universidad del NOSE</h1>
            <Link to="/perfil/admin" className="text-sm font-medium border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-red-900 transition">
              ← Volver al Panel
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 space-y-10">
        <div>
          <span className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3">SECCIÓN 02</span>
          <h2 className="text-3xl font-bold text-red-900">Control de Bloqueos / Inhabilitación</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl">Deshabilita fechas festivas, suspende el servicio temporalmente o bloquea usuarios que infrinjan las normas del comedor.</p>
        </div>

        <div className={`rounded-2xl p-6 shadow-sm border flex items-center justify-between gap-6 ${servicioSuspendido ? 'bg-red-50 border-red-300' : 'bg-white border-slate-200'}`}>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Suspensión Temporal del Servicio</h3>
            <p className="text-slate-500 text-sm mt-1">
              {servicioSuspendido ? 'El servicio está SUSPENDIDO. Los alumnos no podrán generar nuevas reservas.' : 'El servicio está operativo. Los alumnos pueden reservar con normalidad.'}
            </p>
          </div>
          <button onClick={toggleServicio} className={`text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${servicioSuspendido ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-800 hover:bg-red-900 text-white'}`}>
            {servicioSuspendido ? 'Reactivar Servicio' : 'Suspender Servicio'}
          </button>
        </div>

        {loading ? (
           <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-900"></div></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PANEL FECHAS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Fechas Inhabilitadas</h3>
              <form onSubmit={handleAgregarFecha} className="space-y-3 mb-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Fecha</label>
                  <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Motivo</label>
                  <input type="text" value={motivoFecha} onChange={(e) => setMotivoFecha(e.target.value)} placeholder="Ej. Feriado nacional" className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 bg-gray-50" />
                </div>
                <button type="submit" className="w-full bg-red-50 hover:bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider py-2.5 border border-red-200 rounded-xl transition-colors cursor-pointer">Bloquear Fecha</button>
              </form>
              <ul className="space-y-2">
                {fechas.map((f) => (
                  <li key={f.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
                    <div>
                      <span className="font-mono font-bold text-slate-800 text-sm">{formatearFecha(f.fecha)}</span>
                      <span className="block text-xs text-slate-500">{f.motivo}</span>
                    </div>
                    <button onClick={() => handleEliminarFecha(f.id)} className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-600 cursor-pointer">Quitar</button>
                  </li>
                ))}
                {fechas.length === 0 && <li className="text-center text-slate-400 text-sm py-4">No hay fechas bloqueadas.</li>}
              </ul>
            </div>

            {/* PANEL USUARIOS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Usuarios Bloqueados</h3>
              <form onSubmit={handleAgregarUsuario} className="space-y-3 mb-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Nombre o Correo</label>
                  <input type="text" value={usuarioStr} onChange={(e) => setUsuarioStr(e.target.value)} placeholder="Ej. juan.perez@uni.edu" className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Motivo</label>
                  <input type="text" value={motivoUsuario} onChange={(e) => setMotivoUsuario(e.target.value)} placeholder="Ej. Reservas no recogidas reiteradas" className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 bg-gray-50" />
                </div>
                <button type="submit" className="w-full bg-red-50 hover:bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider py-2.5 border border-red-200 rounded-xl transition-colors cursor-pointer">Bloquear Usuario</button>
              </form>
              <ul className="space-y-2">
                {usuarios.map((u) => (
                  <li key={u.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
                    <div>
                      <span className="font-bold text-slate-800 text-sm">{u.nombres} {u.apellidos} {u.correo ? `(${u.correo})` : ''}</span>
                      <span className="block text-xs text-slate-500">{u.motivoBloqueo}</span>
                    </div>
                    <button onClick={() => handleEliminarUsuario(u.id)} className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-green-600 cursor-pointer">Desbloquear</button>
                  </li>
                ))}
                {usuarios.length === 0 && <li className="text-center text-slate-400 text-sm py-4">No hay usuarios bloqueados.</li>}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
