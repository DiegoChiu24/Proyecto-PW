import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';

const BLOQUES_INICIALES = [
  { id: 1, hora: '12:00', etiqueta: '12:00 PM', capacidad: 30, activo: true },
  { id: 2, hora: '12:30', etiqueta: '12:30 PM', capacidad: 30, activo: true },
  { id: 3, hora: '13:00', etiqueta: '01:00 PM', capacidad: 30, activo: true },
  { id: 4, hora: '13:30', etiqueta: '01:30 PM', capacidad: 30, activo: true },
  { id: 5, hora: '14:00', etiqueta: '02:00 PM', capacidad: 30, activo: true },
];

const STORAGE_KEY = 'bloques_horarios_comedor';

export default function AdminHorarios() {
  const navigate = useNavigate();

  const [bloques, setBloques] = useState(() => {
    const guardados = localStorage.getItem(STORAGE_KEY);
    return guardados ? JSON.parse(guardados) : BLOQUES_INICIALES;
  });

  const [hora, setHora] = useState('');
  const [capacidad, setCapacidad] = useState('30');

  useEffect(() => {
    const sessionActive = localStorage.getItem('isLoggedIn') === 'true';
    if (!sessionActive) {
      navigate('/login');
    }
  }, [navigate]);

  const persistir = (lista) => {
    setBloques(lista);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  };

  const formatearEtiqueta = (h) => {
    const [hh, mm] = h.split(':').map(Number);
    const sufijo = hh >= 12 ? 'PM' : 'AM';
    const hh12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${String(hh12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${sufijo}`;
  };

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!hora) {
      alert('Selecciona una hora para el nuevo bloque.');
      return;
    }
    if (bloques.some((b) => b.hora === hora)) {
      alert('Ya existe un bloque con esa hora.');
      return;
    }
    const nuevo = {
      id: bloques.length > 0 ? Math.max(...bloques.map((b) => b.id)) + 1 : 1,
      hora,
      etiqueta: formatearEtiqueta(hora),
      capacidad: parseInt(capacidad, 10) || 0,
      activo: true,
    };
    const lista = [...bloques, nuevo].sort((a, b) => a.hora.localeCompare(b.hora));
    persistir(lista);
    setHora('');
    setCapacidad('30');
  };

  const handleToggle = (id) => {
    persistir(bloques.map((b) => (b.id === id ? { ...b, activo: !b.activo } : b)));
  };

  const handleCapacidad = (id, valor) => {
    persistir(
      bloques.map((b) => (b.id === id ? { ...b, capacidad: parseInt(valor, 10) || 0 } : b))
    );
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Eliminar este bloque horario de forma permanente?')) {
      persistir(bloques.filter((b) => b.id !== id));
    }
  };

  const handleRestaurar = () => {
    if (window.confirm('¿Restaurar los bloques horarios por defecto?')) {
      persistir(BLOQUES_INICIALES);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header backLink="/perfil/admin" backText="← Volver al Panel" variant="red" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 space-y-10">
        <div>
          <span className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3">
            SECCIÓN 01
          </span>
          <h2 className="text-3xl font-bold text-red-900">Gestión de Bloques Horarios</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl">
            Configura, modifica y añade los rangos de horas disponibles en los que los alumnos
            pueden agendar el recojo de sus almuerzos. Los bloques inactivos no se mostrarán al reservar.
          </p>
        </div>

        {/* FORMULARIO DE ALTA */}
        <form
          onSubmit={handleAgregar}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-end gap-4"
        >
          <div className="flex-1">
            <Input
              label="Nueva Hora de Recojo"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-40">
            <Input
              label="Capacidad"
              type="number"
              min="0"
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto whitespace-nowrap"
          >
            + Añadir Bloque
          </Button>
        </form>

        {/* TABLA DE BLOQUES */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Hora</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Etiqueta</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Capacidad</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Estado</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bloques.map((b) => (
                <tr key={b.id} className={b.activo ? '' : 'bg-slate-50/60 opacity-70'}>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">{b.hora}</td>
                  <td className="px-6 py-4 text-slate-600">{b.etiqueta}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      value={b.capacidad}
                      onChange={(e) => handleCapacidad(b.id, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md outline-none text-sm text-gray-800 focus:border-red-800 bg-gray-50"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 border rounded-md ${
                        b.activo
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-slate-100 text-slate-500 border-slate-300'
                      }`}
                    >
                      {b.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        onClick={() => handleToggle(b.id)}
                        variant="outline"
                        className="text-xs py-1.5 px-3"
                      >
                        {b.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button
                        onClick={() => handleEliminar(b.id)}
                        variant="text"
                        className="text-xs py-1.5 px-2"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {bloques.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No hay bloques horarios configurados. Añade uno con el formulario superior.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleRestaurar}
            variant="text"
            className="text-xs"
          >
            ↺ Restaurar bloques por defecto
          </Button>
        </div>
      </main>
    </div>
  );
}
