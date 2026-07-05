import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Header from '../components/Header.jsx';
import Button from '../components/Button.jsx';

const STORAGE_KEY = 'mis_reservas_comedor';
const SCANNER_ID = 'lector-qr-admin';

export default function AdminValidarReserva() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [escaneando, setEscaneando] = useState(true);

  useEffect(() => {
    const sessionActive = localStorage.getItem('isLoggedIn') === 'true';
    if (!sessionActive) {
      navigate('/login');
    }
  }, [navigate]);

  const buscarReserva = useCallback((textoQR) => {
    let idTransaccion = null;
    let idReserva = null;

    try {
      const datos = JSON.parse(textoQR);
      idTransaccion = datos.idTransaccion;
      idReserva = datos.id;
    } catch {
      idTransaccion = textoQR;
    }

    const guardadas = localStorage.getItem(STORAGE_KEY);
    const reservas = guardadas ? JSON.parse(guardadas) : [];
    const reserva = reservas.find(
      (r) => r.idTransaccion === idTransaccion || r.id === idReserva
    );

    if (!reserva) {
      setError('Código QR no reconocido en el sistema. Verifica que la reserva exista.');
      setResultado(null);
      return;
    }

    setError('');
    setResultado(reserva);
  }, []);

  useEffect(() => {
    if (!escaneando) return;

    const scanner = new Html5QrcodeScanner(
      SCANNER_ID,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    scannerRef.current = scanner;

    scanner.render(
      (textoDecodificado) => {
        buscarReserva(textoDecodificado);
        setEscaneando(false);
      },
      () => {}
    );

    return () => {
      scannerRef.current?.clear().catch(() => {});
    };
  }, [escaneando, buscarReserva]);

  const handleConfirmarEntrega = () => {
    if (!resultado) return;

    const guardadas = localStorage.getItem(STORAGE_KEY);
    const reservas = guardadas ? JSON.parse(guardadas) : [];
    const actualizadas = reservas.map((r) =>
      r.id === resultado.id
        ? { ...r, estado: 'Entregado', tipoEstado: 'info' }
        : r
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas));
    setResultado({ ...resultado, estado: 'Entregado', tipoEstado: 'info' });
  };

  const handleEscanearOtro = () => {
    setResultado(null);
    setError('');
    setEscaneando(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header backLink="/perfil/admin" backText="← Volver al Panel" variant="red" />

      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-12 space-y-8">
        <div>
          <span className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3">
            VALIDACIÓN DE ENTREGA
          </span>
          <h2 className="text-3xl font-bold text-red-900">Escanear Ticket QR</h2>
          <p className="text-slate-500 text-sm mt-2">
            Apunta la cámara al código QR que el alumno muestra en su ticket para validar la entrega del pedido.
          </p>
        </div>

        {escaneando && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div id={SCANNER_ID} />
          </div>
        )}

        {error && !resultado && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-4">
            <p className="text-red-800 font-medium text-sm">{error}</p>
            <Button onClick={handleEscanearOtro} variant="danger">
              Intentar de nuevo
            </Button>
          </div>
        )}

        {resultado && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-gray-400 block">
                  CÓDIGO #00{resultado.id}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{resultado.plato}</h3>
                <p className="text-sm text-gray-500">
                  {resultado.fecha} — {resultado.hora}
                </p>
              </div>
              <span
                className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 border ${
                  resultado.tipoEstado === 'success'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : resultado.tipoEstado === 'warning'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : resultado.tipoEstado === 'info'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {resultado.estado}
              </span>
            </div>

            {resultado.estado === 'Cancelada' && (
              <p className="text-sm text-red-700 font-medium">
                Esta reserva fue cancelada. No se puede entregar el pedido.
              </p>
            )}

            {resultado.estado === 'Entregado' && (
              <p className="text-sm text-blue-700 font-medium">
                Este pedido ya fue entregado anteriormente.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              {resultado.estado !== 'Cancelada' && resultado.estado !== 'Entregado' && (
                <Button onClick={handleConfirmarEntrega} variant="primary" className="flex-1">
                  Confirmar Entrega
                </Button>
              )}
              <Button onClick={handleEscanearOtro} variant="outline" className="flex-1">
                Escanear otro código
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
