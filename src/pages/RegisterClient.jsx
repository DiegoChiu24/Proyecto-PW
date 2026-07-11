import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function RegisterClient() {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [codigoUniversitario, setCodigoUniversitario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        confirmButtonColor: '#801414',
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register/cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombres, apellidos, codigoUniversitario, correo, password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error en el registro');

      await Swal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: data.mensaje || 'Tu cuenta ha sido creada correctamente.',
        confirmButtonColor: '#801414',
      });
      
      navigate('/login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error de registro',
        text: err.message,
        confirmButtonColor: '#801414',
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#801414] text-white p-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Universidad del NOSE</h2>
          <p className="text-red-200 text-xs mt-1 uppercase tracking-wider font-semibold">
            Registro - Cliente
          </p>
        </div>
        <form className="p-8 space-y-4" onSubmit={handleSubmit}>
          <div className="text-center mb-2">
            <h3 className="text-xl font-bold text-slate-800">Formulario de Datos</h3>
            <p className="text-slate-400 text-xs mt-1">Completa tus datos para crear una cuenta de cliente</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                Nombres
              </label>
              <input 
                type="text" 
                placeholder="Juan" 
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                Apellidos
              </label>
              <input 
                type="text" 
                placeholder="Pérez" 
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              Código Universitario
            </label>
            <input 
              type="text" 
              placeholder="20261234" 
              value={codigoUniversitario}
              onChange={(e) => setCodigoUniversitario(e.target.value)}
              required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              placeholder="juan.perez@universidad.edu.pe" 
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              Contraseña
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              Confirmar Contraseña
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-[#bd0909] hover:bg-[#990707] text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bd0909] cursor-pointer"
            >
              Registrar Cliente
            </button>
          </div>

          <div className="text-center pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <Link to="/register" className="text-[#801414] hover:text-[#bd0909] font-medium transition-colors">
              ← Volver a roles
            </Link>
            <Link to="/login" className="bg-[#1a2e40] hover:bg-[#111f2c] text-white px-3 py-1.5 rounded-lg font-medium shadow-sm transition-colors">
              Iniciar Sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}