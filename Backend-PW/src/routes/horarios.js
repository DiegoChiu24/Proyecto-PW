import { Router } from "express";
import prisma from "../prismaClient.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// Convierte "14:30" -> "02:30 PM"
function formatearEtiqueta(hora) {
  const [hh, mm] = hora.split(":").map(Number);
  const sufijo = hh >= 12 ? "PM" : "AM";
  const hh12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${String(hh12).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${sufijo}`;
}

const BLOQUES_DEFAULT = [
  { hora: "12:00", capacidad: 30 },
  { hora: "12:30", capacidad: 30 },
  { hora: "13:00", capacidad: 30 },
  { hora: "13:30", capacidad: 30 },
  { hora: "14:00", capacidad: 30 },
];

// GET /api/horarios              -> todos
// GET /api/horarios?soloActivos=true -> solo activos (vista de reserva)
router.get("/", async (req, res) => {
  try {
    const where = req.query.soloActivos === "true" ? { activo: true } : {};
    const bloques = await prisma.bloqueHorario.findMany({ where, orderBy: { hora: "asc" } });
    res.json(bloques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar los horarios." });
  }
});

// POST /api/horarios  (admin)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { hora, capacidad } = req.body;
    if (!hora) return res.status(400).json({ error: "La hora es obligatoria." });

    const existe = await prisma.bloqueHorario.findUnique({ where: { hora } });
    if (existe) return res.status(409).json({ error: "Ya existe un bloque con esa hora." });

    const bloque = await prisma.bloqueHorario.create({
      data: { hora, etiqueta: formatearEtiqueta(hora), capacidad: parseInt(capacidad, 10) || 0, activo: true },
    });
    res.status(201).json(bloque);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el bloque horario." });
  }
});

// PUT /api/horarios/:id  (admin)  -> editar capacidad / etiqueta
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { capacidad, etiqueta } = req.body;
    const bloque = await prisma.bloqueHorario.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(capacidad !== undefined && { capacidad: parseInt(capacidad, 10) || 0 }),
        ...(etiqueta !== undefined && { etiqueta }),
      },
    });
    res.json(bloque);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Bloque no encontrado." });
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el bloque." });
  }
});

// PATCH /api/horarios/:id/estado  (admin)  -> activar/desactivar
router.patch("/:id/estado", requireAdmin, async (req, res) => {
  try {
    const { activo } = req.body;
    const bloque = await prisma.bloqueHorario.update({
      where: { id: Number(req.params.id) },
      data: { activo: Boolean(activo) },
    });
    res.json(bloque);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Bloque no encontrado." });
    console.error(err);
    res.status(500).json({ error: "Error al cambiar el estado del bloque." });
  }
});

// DELETE /api/horarios/:id  (admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.bloqueHorario.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensaje: "Bloque eliminado." });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Bloque no encontrado." });
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el bloque." });
  }
});

// POST /api/horarios/restaurar  (admin)  -> vuelve a los bloques por defecto
router.post("/restaurar", requireAdmin, async (req, res) => {
  try {
    await prisma.bloqueHorario.deleteMany({});
    await prisma.bloqueHorario.createMany({
      data: BLOQUES_DEFAULT.map((b) => ({ ...b, etiqueta: formatearEtiqueta(b.hora), activo: true })),
    });
    const bloques = await prisma.bloqueHorario.findMany({ orderBy: { hora: "asc" } });
    res.json(bloques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al restaurar los bloques por defecto." });
  }
});

export default router;
