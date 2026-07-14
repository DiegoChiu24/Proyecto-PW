import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAuthHeaders } from '../api.js';

const API_URL = 'https://proyecto-pw-ziku.onrender.com/api/auth';

function authHeaders() {
  return getAuthHeaders();
}

export default function PerfilCliente() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return location.state?.isLoggedIn || localStorage.getItem('isLoggedIn') === 'true';
  });

  const [nombreNav, setNombreNav] = useState(() => {
    return location.state?.nombreUsuario || localStorage.getItem('nombreUsuario') || 'Usuario';
  });

  const [rolUsuario, setRolUsuario] = useState(() => {
    return location.state?.rol || localStorage.getItem('rolUsuario') || 'Cliente';
  });

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${API_URL}/perfil`, { headers: authHeaders() });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            nombres: data.nombres || '',
            apellidos: data.apellidos || '',
            correo: data.correo || '',
            telefono: data.telefono || ''
          });
          if (data.nombres) setNombreNav(data.nombres);
        }
      } catch (err) {
        console.error("Error al cargar perfil", err);
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) fetchPerfil();
  }, [isLoggedIn]);

  const handleCerrarSesion = () => {
    setMenuAbierto(false);
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/', { state: {} });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/perfil`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar');
      
      setNombreNav(formData.nombres);
      localStorage.setItem('nombreUsuario', formData.nombres);

      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: data.mensaje || 'Perfil actualizado correctamente.',
        confirmButtonColor: '#801414',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#801414' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-red-900 text-white">
        <header className="w-full border-b border-red-700">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-wide">Universidad del NOSE</h1>
            <div className="flex gap-4">
              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    className="flex items-center gap-3 bg-red-800 border border-red-700 px-4 py-1.5 rounded-md hover:bg-red-750 transition cursor-pointer select-none"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm font-medium tracking-wide">{nombreNav} ({rolUsuario}) ▼</span>
                  </button>
                  {menuAbierto && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50">
                      <Link to="/" onClick={() => setMenuAbierto(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 font-medium">Ir al Home</Link>
                      <hr className="border-gray-150 my-1" />
                      <button onClick={handleCerrarSesion} className="block w-full text-left px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 font-semibold cursor-pointer">Cerrar Sesión</button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-red-900 mb-8">Bienvenido {nombreNav}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Editar Información de tu Cuenta</h3>
            
            {loading ? (
              <div className="py-10 text-center text-slate-400">Cargando perfil...</div>
            ) : (
              <form onSubmit={handleGuardar} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Nombres</label>
                    <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Apellidos</label>
                    <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Correo Electrónico</label>
                  <input type="email" name="correo" value={formData.correo} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Teléfono</label>
                  <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm" />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button type="submit" disabled={saving} className="bg-red-900 hover:bg-red-800 disabled:bg-red-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer text-sm">
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">Accesos rápidos</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Gestiona las solicitudes de almuerzo enviadas al comedor universitario fácilmente.</p>
            </div>
            <div className="mt-6 space-y-3">
              <Link to="/misreservas" className="block w-full bg-[#1a2e40] hover:bg-[#111f2c] text-white text-center font-medium py-2.5 px-4 rounded-xl shadow-md text-sm transition">Ver Mis Reservas →</Link>
              <Link to="/" className="block w-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-center font-medium py-2.5 px-4 rounded-xl text-sm transition">Volver a la Carta</Link>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}