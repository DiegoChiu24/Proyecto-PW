import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';

export default function Register() {
  const [role, setRole] = useState('client');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'admin') {
      navigate('/register/admin');
    } else {
      navigate('/register/client');
    }
  };

  const roleOptions = [
    { value: 'client', label: 'Cliente' },
    { value: 'admin', label: 'Administrador' }
  ];

  return (
    <AuthCard
      subtitle="Sistema de Registro"
      title="Seleccionar Rol"
      innerSubtitle="Elige tu rol para continuar con el registro"
      onSubmit={handleSubmit}
      spacing="space-y-6"
    >
      <Input
        label="Tipo de Usuario"
        type="select"
        required
        value={role}
        onChange={(e) => setRole(e.target.value)}
        options={roleOptions}
      />

      <div className="pt-2">
        <Button type="submit" variant="primary" className="w-full">
          Continuar
        </Button>
      </div>

      <div className="text-center pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
        <span className="text-slate-400">¿Ya tienes una cuenta?</span>
        <Link to="/login" className="bg-[#1a2e40] hover:bg-[#111f2c] text-white px-3 py-1.5 rounded-lg font-medium shadow-sm transition-colors">
          Iniciar Sesión
        </Link>
      </div>
    </AuthCard>
  );
}