import React from 'react';

export default function Login() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#801414] text-white p-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Universidad del NOSE</h2>
          <p className="text-red-200 text-xs mt-1 uppercase tracking-wider font-semibold">
            Sistema de inicio de sesión
          </p>
        </div>
        <form className="p-8 space-y-6">
          <div className="text-center mb-2">
            <h3 className="text-xl font-bold text-slate-800">Iniciar Sesión</h3>
            <p className="text-slate-400 text-xs mt-1">Ingresa tu informacion</p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Correo Electrónico
            </label>
            <input type="email" placeholder="ejemplo@universidad.edu.pe" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Contraseña
            </label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all"/>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Tipo de Usuario
            </label>
            <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#801414] focus:border-[#801414] outline-none text-sm text-slate-800 transition-all">
              <option value="client">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-[#bd0909] hover:bg-[#990707] text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bd0909]">
              Ingresar
            </button>
          </div>
          <div className="text-center pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-400">¿No tienes cuenta?</span>
            <a href="/todavia no hay" className="bg-[#1a2e40] hover:bg-[#111f2c] text-white px-3 py-1.5 rounded-lg font-medium shadow-sm transition-colors">
              Registrate
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}