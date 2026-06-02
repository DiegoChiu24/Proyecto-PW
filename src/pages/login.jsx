import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  
  // Estados para capturar las credenciales
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('client'); // 'client' o 'admin'

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación simple en desarrollo: si están vacíos no avanza
    if (!correo || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // 1. Extraer un nombre simulado basado en el correo electrónico
    const nombreSimulado = correo.split('@')[0];

    // 2. Traducir el rol para que coincida con lo que esperan tus componentes Perfil
    const rolFormateado = tipoUsuario === 'admin' ? 'Admin' : 'Alumno';

    // 3. Guardar la sesión en localStorage para que persista al recargar
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('nombreUsuario', nombreSimulado);
    localStorage.setItem('rolUsuario', rolFormateado);

    // 4. Redirigir según el tipo de usuario seleccionado
    if (tipoUsuario === 'admin') {
      navigate('/perfil/admin', { 
        state: { isLoggedIn: true, nombreUsuario: nombreSimulado, rol: 'Admin' } 
      });
    } else {
      navigate('/perfil', { 
        state: { isLoggedIn: true, nombreUsuario: nombreSimulado, rol: 'Alumno' } 
      });
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
            <p className="text-slate-400 text-xs mt-1">Ingresa tu información de prueba</p>
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Tipo de Usuario
            </label>
            <select 
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all"
            >
              <option value="client">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-[#bd0909] hover:bg-[#990707] text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bd0909]"
            >
              Ingresar
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