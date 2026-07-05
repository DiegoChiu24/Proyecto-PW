# Definición de Endpoints — Sistema de Reservas "Universidad del NOSE"

> Documento para **revisión** antes de implementar. Backend: Node.js + Express. Base de datos: PostgreSQL + Prisma.
> Auth acordada: **sin JWT**. El login/registro devuelve el objeto de usuario; el frontend lo guarda en `sessionStorage`
> (reemplazando el `localStorage` actual). Las rutas de admin se marcan como "requiere Admin": por ahora se validará
> enviando el `usuarioId`/`rol` del solicitante (header `x-user-id` o en el body), no hay protección criptográfica.

Base URL propuesta: `http://localhost:5000/api`

Convenciones:
- Respuestas siempre en JSON.
- Errores con forma `{ "error": "mensaje legible" }` y código HTTP adecuado (400, 401, 403, 404, 409, 500).
- Fechas en la BD/endpoints en formato ISO `YYYY-MM-DD`. El frontend hoy muestra `DD/MM/YYYY`; la conversión se hace en el front.

---

## 1. Modelos de datos (implícitos en el frontend)

### Usuario
| Campo | Tipo | Notas |
|---|---|---|
| id | Int (PK) | autoincrement |
| nombres | String | |
| apellidos | String | |
| correo | String | único |
| password | String | hash (bcrypt) |
| codigoUniversitario | String? | solo Cliente |
| rol | Enum `Cliente` \| `Admin` | |
| bloqueado | Boolean | default false |
| motivoBloqueo | String? | |
| creadoEn | DateTime | |

### Plato (carta)
| Campo | Tipo | Notas |
|---|---|---|
| id | Int (PK) | |
| nombre | String | |
| descripcion | String | |
| precio | Decimal | ej. 20.00 |
| tipo | String? | ej. "Carta", "Menú" |
| imagen | String? | ruta/URL |
| disponible | Boolean | default true |
| creadoEn | DateTime | |

### MenuDelDia
| Campo | Tipo | Notas |
|---|---|---|
| id | Int (PK) | |
| fecha | Date | único por fecha |
| entrada | String | |
| platoPrincipal | String | |
| bebida | String | |
| precio | Decimal | |

### BloqueHorario
| Campo | Tipo | Notas |
|---|---|---|
| id | Int (PK) | |
| hora | String | ej. "12:00" (único) |
| etiqueta | String | ej. "12:00 PM" (se puede autogenerar) |
| capacidad | Int | |
| activo | Boolean | default true |

### Reserva
| Campo | Tipo | Notas |
|---|---|---|
| id | Int (PK) | |
| usuarioId | Int (FK Usuario) | |
| platoId | Int (FK Plato) | |
| platoNombre | String | *snapshot* del nombre al reservar |
| precio | Decimal | *snapshot* del precio al reservar |
| fecha | Date | día del almuerzo |
| hora | String | referencia al bloque horario (ej. "13:00") |
| estado | Enum `Confirmada` \| `Pendiente` \| `Cancelada` | |
| codigo | String | ticket, ej. "TX-...", único |
| creadoEn | DateTime | |

### FechaBloqueada
| Campo | Tipo | Notas |
|---|---|---|
| id | Int (PK) | |
| fecha | Date | única |
| motivo | String | |

### ConfiguracionServicio (fila única / singleton)
| Campo | Tipo | Notas |
|---|---|---|
| id | Int (PK) | siempre 1 |
| servicioSuspendido | Boolean | default false |

> Nota: los "usuarios bloqueados" del panel admin se modelan con los campos `bloqueado`/`motivoBloqueo` de **Usuario**
> (bloqueo por id/correo), en vez de una tabla aparte.

---

## 2. Auth (`/api/auth`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register/cliente` | Público | Registra un Cliente |
| POST | `/auth/register/admin` | Público (+ key) | Registra un Admin validando la key del encargado |
| POST | `/auth/login` | Público | Inicia sesión |
| POST | `/auth/logout` | Autenticado | Opcional (el front solo limpia `sessionStorage`) |
| GET | `/auth/me?usuarioId=` | Autenticado | Opcional: devuelve el usuario actual |

**POST `/auth/register/cliente`**
```jsonc
// request
{ "nombres": "Juan", "apellidos": "Pérez", "codigoUniversitario": "20261234",
  "correo": "juan.perez@universidad.edu.pe", "password": "secreta123" }
// 201 response
{ "id": 5, "nombres": "Juan", "apellidos": "Pérez", "correo": "...", "rol": "Cliente" }
// 409 si el correo ya existe
```

**POST `/auth/register/admin`**
```jsonc
// request
{ "nombres": "Carlos", "apellidos": "Gómez", "correo": "...", "password": "...",
  "keyEncargado": "CLAVE-ADMIN" }
// 201 -> { id, nombres, apellidos, correo, rol: "Admin" }
// 403 si keyEncargado es inválida
```
> La key válida se guarda en variable de entorno del backend (`ADMIN_KEY`).

**POST `/auth/login`**
```jsonc
// request
{ "correo": "...", "password": "...", "tipoUsuario": "cliente" | "admin" }
// 200
{ "id": 5, "nombres": "Juan", "apellidos": "Pérez", "rol": "Cliente" }
// 401 credenciales inválidas · 403 si el usuario está bloqueado
```
> El frontend hoy simula el nombre con `correo.split('@')[0]`; con esto usará el `nombres` real.

---

## 3. Platos / Carta (`/api/platos`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/platos` | Público | Lista platos (por defecto solo `disponible=true`; `?todos=true` para admin) |
| GET | `/platos/:id` | Público | Detalle de un plato |
| POST | `/platos` | Admin | Crea un plato |
| PUT | `/platos/:id` | Admin | Edita un plato |
| DELETE | `/platos/:id` | Admin | Elimina un plato |

**POST/PUT body**
```jsonc
{ "nombre": "Lomo Saltado", "descripcion": "...", "precio": 20.00,
  "tipo": "Carta", "imagen": "/imagenes/lomo-saltado.jpg", "disponible": true }
```
> Reemplaza los arreglos `platosDeCarta` / `PLATOS_SELECCIONABLES` hardcodeados en `Home.jsx` y `reservar.jsx`.

---

## 4. Menú del Día (`/api/menu-dia`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/menu-dia?fecha=YYYY-MM-DD` | Público | Menú de la fecha (por defecto hoy) |
| POST | `/menu-dia` | Admin | Crea/define el menú de una fecha |
| PUT | `/menu-dia/:id` | Admin | Edita |
| DELETE | `/menu-dia/:id` | Admin | Elimina |

```jsonc
// GET 200
{ "id": 1, "fecha": "2026-07-03", "entrada": "Ensalada fresca",
  "platoPrincipal": "Arroz chaufa con pollo", "bebida": "Chicha morada", "precio": 12.00 }
```
> Alimenta la sección "Menú del Día" de `Home.jsx` y la opción "Menú del Día" de `reservar.jsx`.

---

## 5. Bloques Horarios (`/api/horarios`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/horarios` | Público | Lista bloques. `?soloActivos=true` para la vista de reserva |
| POST | `/horarios` | Admin | Añade un bloque |
| PUT | `/horarios/:id` | Admin | Edita (capacidad / etiqueta) |
| PATCH | `/horarios/:id/estado` | Admin | Activa/desactiva (`{ "activo": true }`) |
| DELETE | `/horarios/:id` | Admin | Elimina |

```jsonc
// POST body
{ "hora": "14:30", "capacidad": 30 }   // etiqueta se autogenera -> "02:30 PM"
// GET 200
[ { "id":1, "hora":"12:00", "etiqueta":"12:00 PM", "capacidad":30, "activo":true }, ... ]
```
> Reemplaza `bloques_horarios_comedor` de `AdminHorarios.jsx` y las horas fijas del `<select>` en `reservar.jsx`.
> El "Restaurar por defecto" del front puede resolverse re-sembrando o con un `POST /horarios/restaurar` (opcional).

---

## 6. Reservas (`/api/reservas`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/reservas` | Cliente | Crea una reserva |
| GET | `/reservas/mias?usuarioId=` | Cliente | Reservas del usuario |
| GET | `/reservas/:id` | Cliente/Admin | Detalle (para "Ver Ticket / QR") |
| PATCH | `/reservas/:id/cancelar` | Cliente | Cancela (estado → Cancelada) |
| GET | `/reservas?fecha=YYYY-MM-DD` | Admin | Todas las reservas (para reporte) |

**POST `/reservas`**
```jsonc
// request
{ "usuarioId": 5, "platoId": 1, "fecha": "2026-07-05", "hora": "13:00" }
// 201
{ "id": 12, "codigo": "TX-1720033000", "platoNombre": "Lomo Saltado", "precio": 20.00,
  "fecha": "2026-07-05", "hora": "13:00", "estado": "Confirmada" }
```
Validaciones del backend al crear (hoy las simula el front):
1. `409` si el **servicio está suspendido**.
2. `409` si la **fecha está bloqueada**.
3. `403` si el **usuario está bloqueado**.
4. `400` si el **bloque horario no existe o está inactivo**.
5. `409` si el bloque horario ya **alcanzó su capacidad** para esa fecha.

> Reemplaza `mis_reservas_comedor` de `MisReservas.jsx` y el flujo de `reservar.jsx`.

---

## 7. Bloqueos y Servicio (`/api/bloqueos`, `/api/servicio`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/servicio/estado` | Público | `{ "servicioSuspendido": false }` |
| PATCH | `/servicio/estado` | Admin | Suspende/reactiva (`{ "servicioSuspendido": true }`) |
| GET | `/bloqueos/fechas` | Admin | Lista de fechas bloqueadas |
| POST | `/bloqueos/fechas` | Admin | Bloquea una fecha (`{ "fecha", "motivo" }`) |
| DELETE | `/bloqueos/fechas/:id` | Admin | Quita el bloqueo de fecha |
| GET | `/bloqueos/usuarios` | Admin | Lista de usuarios bloqueados |
| POST | `/bloqueos/usuarios` | Admin | Bloquea usuario (`{ "correo" o "usuarioId", "motivo" }`) |
| DELETE | `/bloqueos/usuarios/:id` | Admin | Desbloquea usuario |

> Reemplaza `bloqueos_comedor` de `AdminBloqueos.jsx` (servicio suspendido + fechas + usuarios).
> `GET /servicio/estado` y las fechas bloqueadas se consultan también desde `reservar.jsx` para validar antes de reservar.

---

## 8. Reportes (`/api/reportes`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/reportes/diario?fecha=YYYY-MM-DD` | Admin | Resumen agregado del día |

```jsonc
// 200
{
  "fecha": "2026-07-03",
  "totalPlatos": 42,
  "variedad": 6,
  "ingresos": 812.00,
  "desglose": [
    { "plato": "Lomo Saltado", "cantidad": 12, "ingresos": 240.00 },
    { "plato": "Ají de Gallina", "cantidad": 8, "ingresos": 120.00 }
  ]
}
```
> Alimenta las tarjetas y la tabla de `AdminReporte.jsx`. La exportación a CSV se puede seguir generando en el frontend
> a partir de este JSON (como ya lo hace), o añadir `GET /reportes/diario/csv` si prefieres que lo genere el backend.

---

## 9. Resumen de rutas

```
POST   /api/auth/register/cliente
POST   /api/auth/register/admin
POST   /api/auth/login
POST   /api/auth/logout                 (opcional)
GET    /api/auth/me                      (opcional)

GET    /api/platos
GET    /api/platos/:id
POST   /api/platos                       (admin)
PUT    /api/platos/:id                   (admin)
DELETE /api/platos/:id                   (admin)

GET    /api/menu-dia
POST   /api/menu-dia                     (admin)
PUT    /api/menu-dia/:id                 (admin)
DELETE /api/menu-dia/:id                 (admin)

GET    /api/horarios
POST   /api/horarios                     (admin)
PUT    /api/horarios/:id                 (admin)
PATCH  /api/horarios/:id/estado          (admin)
DELETE /api/horarios/:id                 (admin)

POST   /api/reservas                     (cliente)
GET    /api/reservas/mias                (cliente)
GET    /api/reservas/:id
PATCH  /api/reservas/:id/cancelar        (cliente)
GET    /api/reservas                     (admin, reporte)

GET    /api/servicio/estado
PATCH  /api/servicio/estado              (admin)
GET    /api/bloqueos/fechas              (admin)
POST   /api/bloqueos/fechas              (admin)
DELETE /api/bloqueos/fechas/:id          (admin)
GET    /api/bloqueos/usuarios            (admin)
POST   /api/bloqueos/usuarios            (admin)
DELETE /api/bloqueos/usuarios/:id        (admin)

GET    /api/reportes/diario              (admin)
```

---

## 10. Puntos abiertos para tu revisión

1. **Auth**: confirmado sin JWT (usuario en `sessionStorage`). ¿Quieres al menos un header `x-user-id` para que el backend valide rol en rutas admin, o dejamos la validación de rol solo en el front por ahora?
2. **Snapshot en Reserva**: guardo `platoNombre` y `precio` en la reserva para que el reporte histórico no cambie si luego editas/eliminas el plato. ¿De acuerdo?
3. **Capacidad**: ¿la capacidad del bloque horario se cuenta por fecha (recomendado) o es un cupo global?
4. **Menú del Día**: ¿uno por fecha (modelo propuesto) o un menú fijo único?
5. **CSV**: ¿lo sigue generando el front o quieres endpoint dedicado en el backend?
6. **Restaurar horarios por defecto**: ¿lo mantenemos como acción del backend (`POST /horarios/restaurar`) o lo quitamos?
