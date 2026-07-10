import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:5000/api/auth';

export default function Login() {
  const navigate = useNavigate();
  
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos.',
        confirmButtonColor: '#801414',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // El backend devuelve { error: "mensaje" } en caso de error
        setLoading(false);

        // Diferenciar tipo de error por status code
        if (res.status === 403) {
          // Cuenta bloqueada
          Swal.fire({
            icon: 'error',
            title: 'Cuenta bloqueada',
            text: data.error || 'Tu cuenta ha sido bloqueada. Contacta al comedor.',
            confirmButtonColor: '#801414',
          });
        } else if (res.status === 401) {
          // Credenciales inválidas
          Swal.fire({
            icon: 'error',
            title: 'Credenciales inválidas',
            text: data.error || 'El correo o la contraseña son incorrectos.',
            confirmButtonColor: '#801414',
          });
        } else {
          // Otro error del servidor
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'Ocurrió un error al iniciar sesión.',
            confirmButtonColor: '#801414',
          });
        }
        return;
      }

      // Login exitoso — guardar datos de sesión en localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('nombreUsuario', data.nombres);
      localStorage.setItem('rolUsuario', data.rol);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('usuario', JSON.stringify(data));

      // Popup de éxito antes de redirigir
      await Swal.fire({
        icon: 'success',
        title: `¡Bienvenido, ${data.nombres}!`,
        text: 'Inicio de sesión exitoso. Serás redirigido.',
        confirmButtonColor: '#801414',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Redirigir según el rol del usuario
      if (data.rol === 'Admin') {
        navigate('/perfil/admin', {
          state: { isLoggedIn: true, nombreUsuario: data.nombres, rol: 'Admin' },
        });
      } else {
        navigate('/perfil', {
          state: { isLoggedIn: true, nombreUsuario: data.nombres, rol: data.rol },
        });
      }
    } catch (err) {
      // Error de red (backend caído, sin conexión, etc.)
      Swal.fire({
        icon: 'error',
        title: 'Sin conexión',
        text: 'No se pudo conectar con el servidor. Verifica que el backend esté activo.',
        confirmButtonColor: '#801414',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#801414] text-white p-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Universidad del NOSE</h2>
          <p className="text-red-200 text-xs mt-1 uppercase tracking-wider font-semibold">
            Sistema de inicio de sesión
          </p>
        </div>

        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="text-center mb-2">
            <h3 className="text-xl font-bold text-slate-800">Iniciar Sesión</h3>
            <p className="text-slate-400 text-xs mt-1">Ingresa tus credenciales</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@universidad.edu.pe" 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Contraseña
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#bd0909] hover:bg-[#990707] disabled:bg-[#cc6666] disabled:cursor-not-allowed text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bd0909] flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              )}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>

          <div className="text-center pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-400">¿No tienes cuenta?</span>
            <Link to="/register" className="bg-[#1a2e40] hover:bg-[#111f2c] text-white px-3 py-1.5 rounded-lg font-medium shadow-sm transition-colors">
              Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}