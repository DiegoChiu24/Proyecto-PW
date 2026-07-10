import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/auth';

export default function Login() {
  const navigate = useNavigate();
  
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!correo || !password) {
      setError('Por favor, completa todos los campos.');
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
        setError(data.error || 'Error al iniciar sesión.');
        setLoading(false);
        return;
      }

      // Login exitoso — guardar datos de sesión en localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('nombreUsuario', data.nombres);
      localStorage.setItem('rolUsuario', data.rol);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('usuario', JSON.stringify(data));

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
      setError('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
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

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              required
              value={correo}
              onChange={(e) => { setCorreo(e.target.value); setError(''); }}
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
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
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