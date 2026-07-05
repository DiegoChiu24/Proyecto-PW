import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';

export default function PerfilAdmin() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn] = useState(() => {
    return location.state?.isLoggedIn || localStorage.getItem('isLoggedIn') === 'true';
  });

  const [nombreUsuario] = useState(() => {
    return location.state?.nombreUsuario || localStorage.getItem('nombreUsuario') || 'Usuario';
  });

  const [rolUsuario] = useState(() => {
    return location.state?.rol || localStorage.getItem('rolUsuario') || 'Admin';
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header variant="red" />

      {/* CUERPO PRINCIPAL */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 space-y-12">
        
        {/* SECCIÓN SUPERIOR: DATOS GENERALES */}
        <div>
          <h2 className="text-3xl font-bold text-red-900 mb-8">
            Bienvenido usuario {nombreUsuario}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                Información de tu Cuenta
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Nombres Completos</p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">{nombreUsuario}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Tipo de Usuario</p>
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-900 rounded-md mt-1">
                    {rolUsuario}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Estado</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-sm font-medium text-slate-800">Conectado / Panel de Administración</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">
                  Accesos rápidos
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Accede al sistema de solicitudes y visualiza la interacción de los alumnos con el comedor.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  to="/misreservas"
                  className="block w-full bg-[#1a2e40] hover:bg-[#111f2c] text-white text-center font-medium py-2.5 px-4 rounded-xl shadow-md transition-all text-sm"
                >
                  Ver Mis Reservas →
                </Link>

                <Link
                  to="/"
                  className="block w-full border border-slate-200 text-slate-650 hover:bg-slate-50 text-center font-medium py-2.5 px-4 rounded-xl transition-all text-sm"
                >
                  Volver a la Carta
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN INFERIOR: TABLA CUADRADA EXCLUSIVA DE ADMIN */}
        <div className="border-t border-slate-200 pt-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Paneles de Control Avanzado</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white border border-gray-300 divide-y lg:divide-y-0 lg:divide-x divide-gray-300 rounded-none shadow-none">
            
            <div className="p-6 flex flex-col justify-between min-h-[260px] rounded-none">
              <div>
                <div className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3 rounded-none">
                  SECCIÓN 01
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 rounded-none">
                  Gestión de Bloques Horarios
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Permite configurar, modificar y añadir los rangos de horas disponibles en los que los alumnos pueden agendar el recojo de sus almuerzos.
                </p>
              </div>
              <Link
                to="/admin/horarios"
                className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 border border-slate-300 transition-colors rounded-none text-center block"
              >
                Configurar Horarios
              </Link>
            </div>

            <div className="p-6 flex flex-col justify-between min-h-[260px] rounded-none">
              <div>
                <div className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3 rounded-none">
                  SECCIÓN 02
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 rounded-none">
                  Admin: Control de Bloqueos/Inhabilitación
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Módulo restrictivo para deshabilitar fechas festivas, suspender el servicio temporalmente o bloquear usuarios que infrinjan las normas del comedor.
                </p>
              </div>
              <Link
                to="/admin/bloqueos"
                className="mt-6 w-full bg-red-50 hover:bg-red-100 text-red-900 text-xs font-bold py-2 px-4 border border-red-200 transition-colors rounded-none text-center block"
              >
                Gestionar Bloqueos
              </Link>
            </div>

            <div className="p-6 flex flex-col justify-between min-h-[260px] rounded-none">
              <div>
                <div className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3 rounded-none">
                  SECCIÓN 03
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 rounded-none">
                  Admin: Reporte Diario de Reservas
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Visualiza y exporta el conteo en tiempo real de los platos solicitados en el día para optimizar la preparación de insumos en la cocina.
                </p>
              </div>
              <Link
                to="/admin/reporte"
                className="mt-6 w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 px-4 border border-slate-950 transition-colors rounded-none text-center block"
              >
                Generar Reporte
              </Link>
            </div>

            <div className="p-6 flex flex-col justify-between min-h-[260px] rounded-none">
              <div>
                <div className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3 rounded-none">
                  SECCIÓN 04
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 rounded-none">
                  Validar Entrega con QR
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Escanea con la cámara el código QR del ticket del alumno para confirmar la entrega de su pedido en el comedor.
                </p>
              </div>
              <Link
                to="/admin/validar"
                className="mt-6 w-full bg-red-800 hover:bg-red-900 text-white text-xs font-bold py-2 px-4 border border-red-950 transition-colors rounded-none text-center block"
              >
                Escanear QR
              </Link>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}