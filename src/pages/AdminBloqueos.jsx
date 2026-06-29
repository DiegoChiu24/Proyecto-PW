import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';

const STORAGE_KEY = 'bloqueos_comedor';

const ESTADO_INICIAL = {
  servicioSuspendido: false,
  fechas: [],
  usuarios: [],
};

export default function AdminBloqueos() {
  const navigate = useNavigate();

  const [data, setData] = useState(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado ? { ...ESTADO_INICIAL, ...JSON.parse(guardado) } : ESTADO_INICIAL;
  });

  const [fecha, setFecha] = useState('');
  const [motivoFecha, setMotivoFecha] = useState('');
  const [usuario, setUsuario] = useState('');
  const [motivoUsuario, setMotivoUsuario] = useState('');

  useEffect(() => {
    const sessionActive = localStorage.getItem('isLoggedIn') === 'true';
    if (!sessionActive) {
      navigate('/login');
    }
  }, [navigate]);

  const persistir = (nuevo) => {
    setData(nuevo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo));
  };

  const toggleServicio = () => {
    persistir({ ...data, servicioSuspendido: !data.servicioSuspendido });
  };

  const handleAgregarFecha = (e) => {
    e.preventDefault();
    if (!fecha) {
      alert('Selecciona una fecha a bloquear.');
      return;
    }
    if (data.fechas.some((f) => f.fecha === fecha)) {
      alert('Esa fecha ya está bloqueada.');
      return;
    }
    const nueva = {
      id: Date.now(),
      fecha,
      motivo: motivoFecha.trim() || 'Día no laborable',
    };
    persistir({ ...data, fechas: [...data.fechas, nueva].sort((a, b) => a.fecha.localeCompare(b.fecha)) });
    setFecha('');
    setMotivoFecha('');
  };

  const handleEliminarFecha = (id) => {
    persistir({ ...data, fechas: data.fechas.filter((f) => f.id !== id) });
  };

  const handleAgregarUsuario = (e) => {
    e.preventDefault();
    if (!usuario.trim()) {
      alert('Indica el nombre o correo del usuario a bloquear.');
      return;
    }
    const nuevo = {
      id: Date.now(),
      nombre: usuario.trim(),
      motivo: motivoUsuario.trim() || 'Incumplimiento de normas',
    };
    persistir({ ...data, usuarios: [...data.usuarios, nuevo] });
    setUsuario('');
    setMotivoUsuario('');
  };

  const handleEliminarUsuario = (id) => {
    persistir({ ...data, usuarios: data.usuarios.filter((u) => u.id !== id) });
  };

  const formatearFecha = (f) => f.split('-').reverse().join('/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header backLink="/perfil/admin" backText="← Volver al Panel" variant="red" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 space-y-10">
        <div>
          <span className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3">
            SECCIÓN 02
          </span>
          <h2 className="text-3xl font-bold text-red-900">Control de Bloqueos / Inhabilitación</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl">
            Deshabilita fechas festivas, suspende el servicio temporalmente o bloquea usuarios que
            infrinjan las normas del comedor.
          </p>
        </div>

        {/* SUSPENSIÓN GLOBAL DE SERVICIO */}
        <div
          className={`rounded-2xl p-6 shadow-sm border flex items-center justify-between gap-6 ${
            data.servicioSuspendido ? 'bg-red-50 border-red-300' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <h3 className="text-lg font-bold text-slate-800">Suspensión Temporal del Servicio</h3>
            <p className="text-slate-500 text-sm mt-1">
              {data.servicioSuspendido
                ? 'El servicio está SUSPENDIDO. Los alumnos no podrán generar nuevas reservas.'
                : 'El servicio está operativo. Los alumnos pueden reservar con normalidad.'}
            </p>
          </div>
          <Button
            onClick={toggleServicio}
            className={`text-xs uppercase tracking-wider py-3 px-6 rounded-xl whitespace-nowrap text-white ${
              data.servicioSuspendido
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-800 hover:bg-red-900'
            }`}
          >
            {data.servicioSuspendido ? 'Reactivar Servicio' : 'Suspender Servicio'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FECHAS BLOQUEADAS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Fechas Inhabilitadas
            </h3>
            <form onSubmit={handleAgregarFecha} className="space-y-3 mb-5">
              <Input
                label="Fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
              <Input
                label="Motivo"
                type="text"
                value={motivoFecha}
                onChange={(e) => setMotivoFecha(e.target.value)}
                placeholder="Ej. Feriado nacional"
              />
              <Button
                type="submit"
                variant="danger"
                className="w-full text-xs uppercase tracking-wider py-2.5 font-bold"
              >
                Bloquear Fecha
              </Button>
            </form>

            <ul className="space-y-2">
              {data.fechas.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-800 text-sm">{formatearFecha(f.fecha)}</span>
                    <span className="block text-xs text-slate-500">{f.motivo}</span>
                  </div>
                  <Button
                    onClick={() => handleEliminarFecha(f.id)}
                    variant="text"
                    className="text-xs uppercase tracking-wider !py-1 !px-2"
                  >
                    Quitar
                  </Button>
                </li>
              ))}
              {data.fechas.length === 0 && (
                <li className="text-center text-slate-400 text-sm py-4">No hay fechas bloqueadas.</li>
              )}
            </ul>
          </div>

          {/* USUARIOS BLOQUEADOS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Usuarios Bloqueados
            </h3>
            <form onSubmit={handleAgregarUsuario} className="space-y-3 mb-5">
              <Input
                label="Nombre o Correo"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ej. juan.perez@uni.edu"
              />
              <Input
                label="Motivo"
                type="text"
                value={motivoUsuario}
                onChange={(e) => setMotivoUsuario(e.target.value)}
                placeholder="Ej. Reservas no recogidas reiteradas"
              />
              <Button
                type="submit"
                variant="danger"
                className="w-full text-xs uppercase tracking-wider py-2.5 font-bold"
              >
                Bloquear Usuario
              </Button>
            </form>

            <ul className="space-y-2">
              {data.usuarios.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5"
                >
                  <div>
                    <span className="font-bold text-slate-800 text-sm">{u.nombre}</span>
                    <span className="block text-xs text-slate-500">{u.motivo}</span>
                  </div>
                  <Button
                    onClick={() => handleEliminarUsuario(u.id)}
                    variant="text"
                    className="text-xs uppercase tracking-wider !py-1 !px-2 !text-green-700 hover:!text-green-950"
                  >
                    Desbloquear
                  </Button>
                </li>
              ))}
              {data.usuarios.length === 0 && (
                <li className="text-center text-slate-400 text-sm py-4">No hay usuarios bloqueados.</li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
