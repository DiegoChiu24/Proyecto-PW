-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('Cliente', 'Admin');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('Confirmada', 'Pendiente', 'Cancelada');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "codigoUniversitario" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'Cliente',
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "motivoBloqueo" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plato" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "tipo" TEXT,
    "imagen" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuDelDia" (
    "id" SERIAL NOT NULL,
    "fecha" TEXT NOT NULL,
    "entrada" TEXT NOT NULL,
    "platoPrincipal" TEXT NOT NULL,
    "bebida" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MenuDelDia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloqueHorario" (
    "id" SERIAL NOT NULL,
    "hora" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BloqueHorario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "platoId" INTEGER NOT NULL,
    "platoNombre" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "fecha" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'Confirmada',
    "codigo" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FechaBloqueada" (
    "id" SERIAL NOT NULL,
    "fecha" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,

    CONSTRAINT "FechaBloqueada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracionServicio" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "servicioSuspendido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ConfiguracionServicio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "MenuDelDia_fecha_key" ON "MenuDelDia"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "BloqueHorario_hora_key" ON "BloqueHorario"("hora");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_codigo_key" ON "Reserva"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "FechaBloqueada_fecha_key" ON "FechaBloqueada"("fecha");

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_platoId_fkey" FOREIGN KEY ("platoId") REFERENCES "Plato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
