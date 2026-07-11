import { Router } from "express";
// import prisma from "../prismaClient.js";
// import { requireAdmin } from "../middleware/auth.js";

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

// ====================================================================
// DATOS MOCK — array en memoria que simula la tabla BloqueHorario
// ====================================================================
let nextId = 6;
let bloquesMock = [
  { id: 1, hora: "12:00", etiqueta: "12:00 PM", capacidad: 30, activo: true },
  { id: 2, hora: "12:30", etiqueta: "12:30 PM", capacidad: 30, activo: true },
  { id: 3, hora: "13:00", etiqueta: "01:00 PM", capacidad: 30, activo: true },
  { id: 4, hora: "13:30", etiqueta: "01:30 PM", capacidad: 30, activo: true },
  { id: 5, hora: "14:00", etiqueta: "02:00 PM", capacidad: 30, activo: true },
];

// GET /api/horarios              -> todos
// GET /api/horarios?soloActivos=true -> solo activos (vista de reserva)
router.get("/", async (req, res) => {
  // --- ORIGINAL (Prisma) ---
  // try {
  //   const where = req.query.soloActivos === "true" ? { activo: true } : {};
  //   const bloques = await prisma.bloqueHorario.findMany({ where, orderBy: { hora: "asc" } });
  //   res.json(bloques);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({ error: "Error al listar los horarios." });
  // }

  // --- MOCK ---
  const soloActivos = req.query.soloActivos === "true";
  const resultado = soloActivos
    ? bloquesMock.filter((b) => b.activo)
    : [...bloquesMock];
  resultado.sort((a, b) => a.hora.localeCompare(b.hora));
  res.json(resultado);
});

// POST /api/horarios  (admin)
router.post("/", /* requireAdmin, */ async (req, res) => {
  // --- ORIGINAL (Prisma) ---
  // try {
  //   const { hora, capacidad } = req.body;
  //   if (!hora) return res.status(400).json({ error: "La hora es obligatoria." });
  //
  //   const existe = await prisma.bloqueHorario.findUnique({ where: { hora } });
  //   if (existe) return res.status(409).json({ error: "Ya existe un bloque con esa hora." });
  //
  //   const bloque = await prisma.bloqueHorario.create({
  //     data: { hora, etiqueta: formatearEtiqueta(hora), capacidad: parseInt(capacidad, 10) || 0, activo: true },
  //   });
  //   res.status(201).json(bloque);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({ error: "Error al crear el bloque horario." });
  // }

  // --- MOCK ---
  const { hora, capacidad } = req.body;
  if (!hora) return res.status(400).json({ error: "La hora es obligatoria." });

  const existe = bloquesMock.find((b) => b.hora === hora);
  if (existe) return res.status(409).json({ error: "Ya existe un bloque con esa hora." });

  const nuevo = {
    id: nextId++,
    hora,
    etiqueta: formatearEtiqueta(hora),
    capacidad: parseInt(capacidad, 10) || 0,
    activo: true,
  };
  bloquesMock.push(nuevo);
  res.status(201).json(nuevo);
});

// PUT /api/horarios/:id  (admin)  -> editar capacidad / etiqueta
router.put("/:id", /* requireAdmin, */ async (req, res) => {
  // --- ORIGINAL (Prisma) ---
  // try {
  //   const { capacidad, etiqueta } = req.body;
  //   const bloque = await prisma.bloqueHorario.update({
  //     where: { id: Number(req.params.id) },
  //     data: {
  //       ...(capacidad !== undefined && { capacidad: parseInt(capacidad, 10) || 0 }),
  //       ...(etiqueta !== undefined && { etiqueta }),
  //     },
  //   });
  //   res.json(bloque);
  // } catch (err) {
  //   if (err.code === "P2025") return res.status(404).json({ error: "Bloque no encontrado." });
  //   console.error(err);
  //   res.status(500).json({ error: "Error al actualizar el bloque." });
  // }

  // --- MOCK ---
  const id = Number(req.params.id);
  const bloque = bloquesMock.find((b) => b.id === id);
  if (!bloque) return res.status(404).json({ error: "Bloque no encontrado." });

  const { capacidad, etiqueta } = req.body;
  if (capacidad !== undefined) bloque.capacidad = parseInt(capacidad, 10) || 0;
  if (etiqueta !== undefined) bloque.etiqueta = etiqueta;

  res.json(bloque);
});

// PATCH /api/horarios/:id/estado  (admin)  -> activar/desactivar
router.patch("/:id/estado", /* requireAdmin, */ async (req, res) => {
  // --- ORIGINAL (Prisma) ---
  // try {
  //   const { activo } = req.body;
  //   const bloque = await prisma.bloqueHorario.update({
  //     where: { id: Number(req.params.id) },
  //     data: { activo: Boolean(activo) },
  //   });
  //   res.json(bloque);
  // } catch (err) {
  //   if (err.code === "P2025") return res.status(404).json({ error: "Bloque no encontrado." });
  //   console.error(err);
  //   res.status(500).json({ error: "Error al cambiar el estado del bloque." });
  // }

  // --- MOCK ---
  const id = Number(req.params.id);
  const bloque = bloquesMock.find((b) => b.id === id);
  if (!bloque) return res.status(404).json({ error: "Bloque no encontrado." });

  bloque.activo = Boolean(req.body.activo);
  res.json(bloque);
});

// DELETE /api/horarios/:id  (admin)
router.delete("/:id", /* requireAdmin, */ async (req, res) => {
  // --- ORIGINAL (Prisma) ---
  // try {
  //   await prisma.bloqueHorario.delete({ where: { id: Number(req.params.id) } });
  //   res.json({ mensaje: "Bloque eliminado." });
  // } catch (err) {
  //   if (err.code === "P2025") return res.status(404).json({ error: "Bloque no encontrado." });
  //   console.error(err);
  //   res.status(500).json({ error: "Error al eliminar el bloque." });
  // }

  // --- MOCK ---
  const id = Number(req.params.id);
  const index = bloquesMock.findIndex((b) => b.id === id);
  if (index === -1) return res.status(404).json({ error: "Bloque no encontrado." });

  bloquesMock.splice(index, 1);
  res.json({ mensaje: "Bloque eliminado." });
});

// POST /api/horarios/restaurar  (admin)  -> vuelve a los bloques por defecto
router.post("/restaurar", /* requireAdmin, */ async (req, res) => {
  // --- ORIGINAL (Prisma) ---
  // try {
  //   await prisma.bloqueHorario.deleteMany({});
  //   await prisma.bloqueHorario.createMany({
  //     data: BLOQUES_DEFAULT.map((b) => ({ ...b, etiqueta: formatearEtiqueta(b.hora), activo: true })),
  //   });
  //   const bloques = await prisma.bloqueHorario.findMany({ orderBy: { hora: "asc" } });
  //   res.json(bloques);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({ error: "Error al restaurar los bloques por defecto." });
  // }

  // --- MOCK ---
  nextId = 6;
  bloquesMock = BLOQUES_DEFAULT.map((b, i) => ({
    id: i + 1,
    hora: b.hora,
    etiqueta: formatearEtiqueta(b.hora),
    capacidad: b.capacidad,
    activo: true,
  }));
  res.json([...bloquesMock]);
});

export default router;
