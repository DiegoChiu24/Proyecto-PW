import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';

export default function Login() {
  const navigate = useNavigate();
  
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('client');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!correo || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const nombreSimulado = correo.split('@')[0];
    const rolFormateado = tipoUsuario === 'admin' ? 'Admin' : 'Alumno';

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('nombreUsuario', nombreSimulado);
    localStorage.setItem('rolUsuario', rolFormateado);

    if (tipoUsuario === 'admin') {
      navigate('/perfil/admin', { 
        state: { isLoggedIn: true, nombreUsuario: nombreSimulado, rol: 'Admin' } 
      });
    } else {
      navigate('/perfil', { 
        state: { isLoggedIn: true, nombreUsuario: nombreSimulado, rol: 'Alumno' } 
      });
    }
  };

  const tipoUsuarioOptions = [
    { value: 'client', label: 'Cliente' },
    { value: 'admin', label: 'Administrador' }
  ];

  return (
    <AuthCard
      subtitle="Sistema de inicio de sesión"
      title="Iniciar Sesión"
      innerSubtitle="Ingresa tu información de prueba"
      onSubmit={handleSubmit}
      spacing="space-y-6"
    >
      <Input
        label="Correo Electrónico"
        type="email"
        required
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        placeholder="ejemplo@universidad.edu.pe"
      />

      <Input
        label="Contraseña"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      <Input
        label="Tipo de Usuario"
        type="select"
        required
        value={tipoUsuario}
        onChange={(e) => setTipoUsuario(e.target.value)}
        options={tipoUsuarioOptions}
      />

      <div className="pt-2">
        <Button type="submit" variant="primary" className="w-full">
          Ingresar
        </Button>
      </div>

      <div className="text-center pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
        <span className="text-slate-400">¿No tienes cuenta?</span>
        <Link to="/register" className="bg-[#1a2e40] hover:bg-[#111f2c] text-white px-3 py-1.5 rounded-lg font-medium shadow-sm transition-colors">
          Regístrate
        </Link>
      </div>
    </AuthCard>
  );
}