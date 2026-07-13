const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function leerStorage(clave) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(clave) ?? window.sessionStorage.getItem(clave);
}

function guardarStorage(clave, valor) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(clave, valor);
  window.sessionStorage.setItem(clave, valor);
}

function parsearUsuario() {
  if (typeof window === "undefined") return null;

  const raw = window.sessionStorage.getItem("usuario") || window.localStorage.getItem("usuario") || "null";
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getStoredUserId() {
  const usuario = parsearUsuario();
  return usuario?.id ?? leerStorage("userId") ?? "";
}

export function getAuthHeaders(extraHeaders = {}) {
  const userId = getStoredUserId();
  return {
    "Content-Type": "application/json",
    ...(userId ? { "x-user-id": String(userId) } : {}),
    ...extraHeaders,
  };
}

async function apiFetch(path, options = {}) {
  const headers = getAuthHeaders(options.headers);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Ocurrió un error inesperado.");
  }
  return data;
}

export function guardarSesion(usuario) {
  const datos = usuario ?? {};
  const usuarioJson = JSON.stringify(datos);

  window.sessionStorage.setItem("usuario", usuarioJson);
  window.sessionStorage.setItem("isLoggedIn", "true");
  window.sessionStorage.setItem("userId", datos.id ?? "");

  window.localStorage.setItem("usuario", usuarioJson);
  window.localStorage.setItem("isLoggedIn", "true");
  window.localStorage.setItem("userId", datos.id ?? "");

  if (datos.nombres) window.localStorage.setItem("nombreUsuario", datos.nombres);
  if (datos.rol) window.localStorage.setItem("rolUsuario", datos.rol);
  if (datos.nombres) window.sessionStorage.setItem("nombreUsuario", datos.nombres);
  if (datos.rol) window.sessionStorage.setItem("rolUsuario", datos.rol);
}

export function obtenerSesion() {
  return parsearUsuario();
}

export function cerrarSesion() {
  window.sessionStorage.removeItem("usuario");
  window.sessionStorage.removeItem("isLoggedIn");
  window.sessionStorage.removeItem("userId");
  window.localStorage.removeItem("usuario");
  window.localStorage.removeItem("isLoggedIn");
  window.localStorage.removeItem("userId");
  window.localStorage.removeItem("nombreUsuario");
  window.localStorage.removeItem("rolUsuario");
  window.sessionStorage.removeItem("nombreUsuario");
  window.sessionStorage.removeItem("rolUsuario");
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