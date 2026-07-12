const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiFetch(path, options = {}) {
  const usuario = JSON.parse(sessionStorage.getItem("usuario") || "null");

  const headers = {
    "Content-Type": "application/json",
    ...(usuario?.id ? { "x-user-id": usuario.id } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Ocurrió un error inesperado.");
  }
  return data;
}

export function guardarSesion(usuario) {
  sessionStorage.setItem("usuario", JSON.stringify(usuario));
  sessionStorage.setItem("isLoggedIn", "true");
}

export function obtenerSesion() {
  return JSON.parse(sessionStorage.getItem("usuario") || "null");
}

export function cerrarSesion() {
  sessionStorage.removeItem("usuario");
  sessionStorage.removeItem("isLoggedIn");
}

export function login(correo, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, password }),
  });
}

export function registrarCliente(datos) {
  return apiFetch("/auth/register/cliente", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function registrarAdmin(datos) {
  return apiFetch("/auth/register/admin", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export async function apiRequest(path, options = {}) {
  return apiFetch(path, options);
}

export default apiFetch;