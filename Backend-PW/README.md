# Backend — Sistema de Reservas del Comedor (Universidad del NOSE)

API REST con **Node.js + Express + Prisma + PostgreSQL**.

## Requisitos
- Node.js 18+
- PostgreSQL corriendo en local

## Puesta en marcha

1. Instala dependencias:
   ```bash
   npm install
   ```

2. Configura el entorno. Copia `.env.example` a `.env` y ajusta tus credenciales:
   ```
   DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/comedor_nose?schema=public"
   PORT=5000
   ADMIN_KEY="CLAVE-ADMIN-2026"
   ```
   > `ADMIN_KEY` es la clave que se valida en el registro de administradores
   > (campo "Key del Encargado" del formulario RegisterAdmin).

3. Crea la base de datos y las tablas:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Carga datos iniciales (platos, horarios, menú del día y usuarios demo):
   ```bash
   npm run seed
   ```
   Usuarios demo (contraseña `123456`):
   - Admin:   `admin@universidad.edu.pe`
   - Cliente: `juan.perez@universidad.edu.pe`

5. Arranca el servidor:
   ```bash
   npm run dev      # con recarga (nodemon)
   # o
   npm start
   ```
   Server en `http://localhost:5000`. Healthcheck: `GET /api/health`.

## Autenticación
Sin JWT. `POST /api/auth/login` devuelve el objeto de usuario; el frontend lo
guarda en `sessionStorage`. Las rutas de administrador exigen el header
`x-user-id` con el id del usuario (middleware valida que el rol sea `Admin`).
Las rutas de cliente (reservas) también usan `x-user-id`.

## Endpoints
Ver `ENDPOINTS.md` para la especificación completa por módulo.
