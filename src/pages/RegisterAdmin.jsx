import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarAdmin, guardarSesion } from '../api';

export default function RegisterAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombres: '', apellidos: '', correo: '',
    password: '', confirmar: '', keyEncargado: '',
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setCargando(true);
      const usuario = await registrarAdmin({
        nombres: form.nombres,
        apellidos: form.apellidos,
        correo: form.correo,
        password: form.password,
        keyEncargado: form.keyEncargado,
      });
      guardarSesion(usuario);
      navigate('/perfil/admin', { state: { usuario } });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#801414] text-white p-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Universidad del NOSE</h2>
          <p className="text-red-200 text-xs mt-1 uppercase tracking-wider font-semibold">
            Registro - Administrador
          </p>
        </div>
        <form className="p-8 space-y-4" onSubmit={handleSubmit}>
          <div className="text-center mb-2">
            <h3 className="text-xl font-bold text-slate-800">Formulario de Datos</h3>
            <p className="text-slate-400 text-xs mt-1">Completa tus datos de acceso y clave de administrador</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Nombres</label>
              <input type="text" name="nombres" placeholder="Carlos" value={form.nombres} onChange={onChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Apellidos</label>
              <input type="text" name="apellidos" placeholder="Gómez" value={form.apellidos} onChange={onChange} required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Correo Electrónico</label>
            <input type="email" name="correo" placeholder="carlos.gomez@universidad.edu.pe" value={form.correo} onChange={onChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Contraseña</label>
            <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={onChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Confirmar Contraseña</label>
            <input type="password" name="confirmar" placeholder="••••••••" value={form.confirmar} onChange={onChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Key del Encargado (Validación)</label>
            <input type="text" name="keyEncargado" placeholder="Ingresa la clave de validación" value={form.keyEncargado} onChange={onChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all" />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={cargando}
              className="w-full bg-[#bd0909] hover:bg-[#990707] disabled:opacity-60 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bd0909] cursor-pointer">
              {cargando ? 'Registrando...' : 'Registrar Administrador'}
            </button>
          </div>

          <div className="text-center pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <Link to="/register" className="text-[#801414] hover:text-[#bd0909] font-medium transition-colors">← Volver a roles</Link>
            <Link to="/login" className="bg-[#1a2e40] hover:bg-[#111f2c] text-white px-3 py-1.5 rounded-lg font-medium shadow-sm transition-colors">Iniciar Sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}