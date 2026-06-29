import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';

export default function RegisterAdmin() {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/', { state: { isLoggedIn: true, nombreUsuario: nombres, rol: 'Admin' } });
  };

  return (
    <AuthCard
      subtitle="Registro - Administrador"
      title="Formulario de Datos"
      innerSubtitle="Completa tus datos de acceso y clave de administrador"
      onSubmit={handleSubmit}
      spacing="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombres"
          placeholder="Carlos"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
          required
        />
        <Input
          label="Apellidos"
          placeholder="Gómez"
          required
        />
      </div>

      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="carlos.gomez@universidad.edu.pe"
        required
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        required
      />

      <Input
        label="Confirmar Contraseña"
        type="password"
        placeholder="••••••••"
        required
      />

      <Input
        label="Key del Encargado (Validación)"
        placeholder="Ingresa la clave de validación"
        required
      />

      <div className="pt-2">
        <Button type="submit" variant="primary" className="w-full">
          Registrar Administrador
        </Button>
      </div>

      <div className="text-center pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
        <Link to="/register" className="text-[#801414] hover:text-[#bd0909] font-medium transition-colors">
          ← Volver a roles
        </Link>
        <Link to="/login" className="bg-[#1a2e40] hover:bg-[#111f2c] text-white px-3 py-1.5 rounded-lg font-medium shadow-sm transition-colors">
          Iniciar Sesión
        </Link>
      </div>
    </AuthCard>
  );
}