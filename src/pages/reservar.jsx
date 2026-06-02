import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PLATOS_SELECCIONABLES = [
  { id: 1, nombre: 'Lomo Saltado', precio: 'S/ 20.00', desc: 'Trozos de carne salteados con cebolla, tomate, papas fritas y arroz.' },
  { id: 2, nombre: 'Ají de Gallina', precio: 'S/ 15.00', desc: 'Pollo deshilachado en cremosa salsa de ají amarillo acompañado de arroz.' },
  { id: 3, nombre: 'Tallarines Verdes', precio: 'S/ 16.00', desc: 'Pasta en salsa de albahaca servida con bistec a la plancha.' },
  { id: 4, nombre: 'Arroz Chaufa', precio: 'S/ 15.00', desc: 'Arroz salteado al estilo oriental con pollo, huevo y cebollita china.' },
  { id: 5, nombre: 'Pollo a la Brasa', precio: 'S/ 18.00', desc: 'Cuarto de pollo acompañado de papas fritas y ensalada fresca.' },
  { id: 6, nombre: 'Seco de Res', precio: 'S/ 19.00', desc: 'Carne cocida en salsa de culantro acompañada de arroz y frejoles.' },
  { id: 7, nombre: 'Causa Limeña', precio: 'S/ 14.00', desc: 'Puré de papa amarilla relleno de pollo y mayonesa.' },
  { id: 8, nombre: 'Milanesa con Arroz', precio: 'S/ 16.00', desc: 'Milanesa de pollo crocante acompañada de arroz y ensalada.' },
  { id: 9, nombre: 'Arroz con Pollo', precio: 'S/ 16.00', desc: 'Arroz verde preparado con culantro acompañado de presa de pollo.' },
  { id: 10, fontName: 'Papa a la Huancaína', nombre: 'Papa a la Huancaína', precio: 'S/ 14.00', desc: 'Papas cocidas cubiertas con una cremosa salsa de queso y ají amarillo.' },
  { id: 11, nombre: 'Chanfainita', precio: 'S/ 15.00', desc: 'Tradicional guiso peruano acompañado de arroz blanco.' },
  { id: 12, nombre: 'Pollo Broaster', precio: 'S/ 18.00', desc: 'Pollo empanizado y crocante acompañado de papas fritas.' },
  { id: 13, nombre: 'Estofado de Pollo', precio: 'S/ 17.00', desc: 'Pollo cocido en salsa de tomate con zanahoria, arvejas y arroz.' },
  { id: 14, fontName: 'Chicharrón de Cerdo', nombre: 'Chicharrón de Cerdo', precio: 'S/ 20.00', desc: 'Trozos de cerdo fritos servidos con camote y salsa criolla.' },
  { id: 15, nombre: 'Tallarines Rojos', precio: 'S/ 15.00', desc: 'Pasta con salsa de tomate casera acompañada de pollo a la plancha.' },
  { id: 16, nombre: 'Bistec a lo Pobre', precio: 'S/ 19.00', desc: 'Bistec acompañado de huevo frito, plátano maduro y arroz.' },
  { id: 17, nombre: 'Menú del Día (Chaufa de Pollo + Entrada + Bebida)', precio: 'S/ 12.00', tipo: 'Menú' }
];

export default function reservar() {
  const navigate = useNavigate();
  const [platoSeleccionado, setPlatoSeleccionado] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  useEffect(() => {
    const sessionActive = localStorage.getItem('isLoggedIn') === 'true';
    if (!sessionActive) {
      alert('Debes registrarte o iniciar sesión para poder realizar una reserva.');
      navigate('/register');
    }
  }, [navigate]);

  const handleProcederReserva = (e) => {
    e.preventDefault();
    
    if (!platoSeleccionado || !fecha || !hora) {
      alert('Por favor, completa todos los campos para tu reserva.');
      return;
    }

    const datosPlato = PLATOS_SELECCIONABLES.find(p => String(p.id) === platoSeleccionado);

    navigate('/misreservas', {
      state: {
        reservaCompletada: true,
        idTransaccion: `tx-${Date.now()}`,
        nombrePlato: datosPlato?.nombre,
        precioPlato: datosPlato?.precio,
        fecha: fecha,
        hora: hora
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-red-900 text-white">
        <header className="w-full border-b border-red-700">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-wide">Universidad del NOSE</h1>
            <div>
              <Link to="/" className="text-sm font-medium border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-red-900 transition">
                ← Volver al Home
              </Link>
            </div>
          </div>
        </header>

        <main className="flex flex-col items-center px-6 py-12 text-center">
          <h2 className="text-4xl font-light tracking-tight">Solicitar Nueva Reserva</h2>
          <p className="mt-2 text-sm text-red-200 uppercase tracking-wider font-semibold">
            Paso único — Elige tu plato y horario
          </p>
        </main>
      </div>

      <section className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2 reserva-title">
              1. Selecciona tu Almuerzo
            </h3>
            <div className="space-y-3">
              {PLATOS_SELECCIONABLES.map((plato) => (
                <label 
                  key={plato.id}
                  className={`reserva-plato-card border flex items-center justify-between p-4 rounded-xl cursor-pointer transition shadow-sm ${
                    platoSeleccionado === String(plato.id)
                      ? 'reserva-plato-card-selected border-red-800 bg-red-50/50 ring-1 ring-red-800'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="plato"
                      value={plato.id}
                      checked={platoSeleccionado === String(plato.id)}
                      onChange={(e) => setPlatoSeleccionado(e.target.value)}
                      className="accent-red-800 w-4 h-4"
                    />
                    <div>
                      <span className="font-medium text-gray-900 reserva-plato-nombre block">{plato.nombre}</span>
                      <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider reserva-plato-tipo">
                        {plato.tipo}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-red-800 reserva-plato-precio">{plato.precio}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleProcederReserva} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
              2. Horario y Entrega
            </h3>
            
            <div className="space-y-4 grow">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                  Fecha del Almuerzo
                </label>
                <input 
                  type="date" 
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 transition-all bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                  Hora de Recojo
                </label>
                <select 
                  required
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm text-gray-800 focus:border-red-800 transition-all bg-gray-50"
                >
                  <option value="">Selecciona una hora...</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="13:30">01:30 PM</option>
                  <option value="14:00">02:00 PM</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <button 
                type="submit"
                className="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-xl font-medium transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Confirmar Reserva →
              </button>
              <p className="text-[11px] text-center text-gray-400 mt-3 leading-normal">
                Al confirmar, se generará tu código de ticket correspondiente automáticamente.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}