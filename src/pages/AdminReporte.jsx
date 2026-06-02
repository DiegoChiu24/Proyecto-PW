import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'mis_reservas_comedor';

const parsePrecio = (precio) => {
  if (!precio) return 0;
  const limpio = String(precio).replace(/[^0-9.]/g, '');
  return parseFloat(limpio) || 0;
};

export default function AdminReporte() {
  const navigate = useNavigate();

  const hoy = new Date();
  const fechaHoyIso = hoy.toISOString().split('T')[0];

  const [reservas] = useState(() => {
    const guardadas = localStorage.getItem(STORAGE_KEY);
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const [fechaFiltro, setFechaFiltro] = useState(fechaHoyIso);

  useEffect(() => {
    const sessionActive = localStorage.getItem('isLoggedIn') === 'true';
    if (!sessionActive) {
      navigate('/login');
    }
  }, [navigate]);

  const fechaFiltroFormato = fechaFiltro.split('-').reverse().join('/');

  const reservasDelDia = useMemo(
    () =>
      reservas.filter(
        (r) => r.fecha === fechaFiltroFormato && r.estado !== 'Cancelada'
      ),
    [reservas, fechaFiltroFormato]
  );

  const resumen = useMemo(() => {
    const mapa = new Map();
    reservasDelDia.forEach((r) => {
      const actual = mapa.get(r.plato) || { plato: r.plato, cantidad: 0, ingresos: 0 };
      actual.cantidad += 1;
      actual.ingresos += parsePrecio(r.precio);
      mapa.set(r.plato, actual);
    });
    return Array.from(mapa.values()).sort((a, b) => b.cantidad - a.cantidad);
  }, [reservasDelDia]);

  const totalPlatos = reservasDelDia.length;
  const totalIngresos = resumen.reduce((acc, r) => acc + r.ingresos, 0);

  const handleExportarCSV = () => {
    if (resumen.length === 0) {
      alert('No hay datos para exportar en la fecha seleccionada.');
      return;
    }
    const encabezado = ['Plato', 'Cantidad', 'Ingresos (S/)'];
    const filas = resumen.map((r) => [r.plato, r.cantidad, r.ingresos.toFixed(2)]);
    filas.push(['TOTAL', totalPlatos, totalIngresos.toFixed(2)]);

    const csv = [encabezado, ...filas]
      .map((fila) => fila.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_comedor_${fechaFiltro}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-red-900 text-white">
        <header className="w-full border-b border-red-700">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-wide">Universidad del NOSE</h1>
            <Link
              to="/perfil/admin"
              className="text-sm font-medium border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-red-900 transition"
            >
              ← Volver al Panel
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3">
              SECCIÓN 03
            </span>
            <h2 className="text-3xl font-bold text-red-900">Reporte Diario de Reservas</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-2xl">
              Conteo de los platos solicitados para optimizar la preparación de insumos en la cocina.
            </p>
          </div>
          <div className="flex items-end gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                Fecha del reporte
              </label>
              <input
                type="date"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 bg-white"
              />
            </div>
            <button
              onClick={handleExportarCSV}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              ↓ Exportar CSV
            </button>
          </div>
        </div>

        {/* TARJETAS RESUMEN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Platos solicitados</p>
            <p className="text-4xl font-black text-red-900 mt-2">{totalPlatos}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Variedad de platos</p>
            <p className="text-4xl font-black text-slate-800 mt-2">{resumen.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Ingresos estimados</p>
            <p className="text-4xl font-black text-green-700 mt-2">S/ {totalIngresos.toFixed(2)}</p>
          </div>
        </div>

        {/* TABLA DE DESGLOSE */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">
              Desglose por plato — {fechaFiltroFormato}
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Plato</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 text-center">Cantidad</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 text-right">Ingresos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resumen.map((r) => (
                <tr key={r.plato}>
                  <td className="px-6 py-4 font-medium text-slate-800">{r.plato}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block min-w-[2rem] text-center font-bold text-red-900 bg-red-50 border border-red-200 rounded-md px-2.5 py-0.5">
                      {r.cantidad}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-700">
                    S/ {r.ingresos.toFixed(2)}
                  </td>
                </tr>
              ))}
              {resumen.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No hay reservas activas registradas para esta fecha.
                  </td>
                </tr>
              )}
            </tbody>
            {resumen.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold">
                  <td className="px-6 py-4 text-slate-800 uppercase text-xs tracking-wider">Total</td>
                  <td className="px-6 py-4 text-center text-red-900">{totalPlatos}</td>
                  <td className="px-6 py-4 text-right font-mono text-green-700">S/ {totalIngresos.toFixed(2)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </main>
    </div>
  );
}
