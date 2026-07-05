import { Router } from "express";
import prisma from "../prismaClient.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// POST /api/reservas  (cliente autenticado)
router.post("/", requireAuth, async (req, res) => {
  try {
    const usuario = req.usuario;
    const { platoId, fecha, hora } = req.body;

    if (!platoId || !fecha || !hora) {
      return res.status(400).json({ error: "Plato, fecha y hora son obligatorios." });
    }

    // 3. Usuario bloqueado
    if (usuario.bloqueado) {
      return res.status(403).json({ error: "Tu cuenta está bloqueada y no puede reservar." });
    }

    // 1. Servicio suspendido
    const config = await prisma.configuracionServicio.findUnique({ where: { id: 1 } });
    if (config?.servicioSuspendido) {
      return res.status(409).json({ error: "El servicio está suspendido temporalmente." });
    }

    // 2. Fecha bloqueada
    const fechaBloqueada = await prisma.fechaBloqueada.findUnique({ where: { fecha } });
    if (fechaBloqueada) {
      return res.status(409).json({ error: `Fecha no disponible: ${fechaBloqueada.motivo}.` });
    }

    // 4. Bloque horario existe y está activo
    const bloque = await prisma.bloqueHorario.findUnique({ where: { hora } });
    if (!bloque || !bloque.activo) {
      return res.status(400).json({ error: "El horario seleccionado no está disponible." });
    }

    // Plato válido
    const plato = await prisma.plato.findUnique({ where: { id: Number(platoId) } });
    if (!plato) {
      return res.status(400).json({ error: "El plato seleccionado no existe." });
    }

    // 5. Capacidad del bloque para esa fecha
    const ocupadas = await prisma.reserva.count({
      where: { hora, fecha, estado: { not: "Cancelada" } },
    });
    if (ocupadas >= bloque.capacidad) {
      return res.status(409).json({ error: "El horario seleccionado ya alcanzó su capacidad." });
    }

    const reserva = await prisma.reserva.create({
      data: {
        usuarioId: usuario.id,
        platoId: plato.id,
        platoNombre: plato.nombre,
        precio: plato.precio,
        fecha,
        hora,
        estado: "Confirmada",
        codigo: `TX-${Date.now()}`,
      },
    });

    res.status(201).json(reserva);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la reserva." });
  }
});

// GET /api/reservas/mias  (reservas del usuario autenticado)
router.get("/mias", requireAuth, async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: req.usuario.id },
      orderBy: { creadoEn: "desc" },
    });
    res.json(reservas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener tus reservas." });
  }
});

// GET /api/reservas?fecha=YYYY-MM-DD  (admin: todas / por fecha)
router.get("/", requireAdmin, async (req, res) => {
  try {
    const { fecha } = req.query;
    const where = fecha ? { fecha } : {};
    const reservas = await prisma.reserva.findMany({ where, orderBy: { creadoEn: "desc" } });
    res.json(reservas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar las reservas." });
  }
});

// GET /api/reservas/:id  (detalle / ticket)
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const reserva = await prisma.reserva.findUnique({ where: { id: Number(req.params.id) } });
    if (!reserva) return res.status(404).json({ error: "Reserva no encontrada." });

    // Un cliente solo puede ver sus propias reservas; el admin puede ver todas.
    if (req.usuario.rol !== "Admin" && reserva.usuarioId !== req.usuario.id) {
      return res.status(403).json({ error: "No tienes acceso a esta reserva." });
    }
    res.json(reserva);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener la reserva." });
  }
});

// PATCH /api/reservas/:id/cancelar
router.patch("/:id/cancelar", requireAuth, async (req, res) => {
  try {
    const reserva = await prisma.reserva.findUnique({ where: { id: Number(req.params.id) } });
    if (!reserva) return res.status(404).json({ error: "Reserva no encontrada." });

    if (req.usuario.rol !== "Admin" && reserva.usuarioId !== req.usuario.id) {
      return res.status(403).json({ error: "No puedes cancelar esta reserva." });
    }
    if (reserva.estado === "Cancelada") {
      return res.status(409).json({ error: "La reserva ya está cancelada." });
    }

    const actualizada = await prisma.reserva.update({
      where: { id: reserva.id },
      data: { estado: "Cancelada" },
    });
    res.json(actualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cancelar la reserva." });
  }
});

export default router;
