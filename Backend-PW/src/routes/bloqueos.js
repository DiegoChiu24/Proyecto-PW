import { Router } from "express";
import prisma from "../prismaClient.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

function sinPassword(u) {
  const { password, ...resto } = u;
  return resto;
}

/* ---------- FECHAS BLOQUEADAS ---------- */

// GET /api/bloqueos/fechas  (admin)
router.get("/fechas", requireAdmin, async (req, res) => {
  return res.status(200).json([
    { id: 1, fecha: "2024-12-25", motivo: "Navidad" },
    { id: 2, fecha: "2024-07-28", motivo: "Fiestas Patrias" }
  ]);
  try {
    const fechas = await prisma.fechaBloqueada.findMany({ orderBy: { fecha: "asc" } });
    res.json(fechas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar las fechas bloqueadas." });
  }
});

// POST /api/bloqueos/fechas  (admin)
router.post("/fechas", requireAdmin, async (req, res) => {
  return res.status(200).json({ mensaje: "Operación simulada con éxito", id: Date.now(), fecha: req.body.fecha, motivo: req.body.motivo });
  try {
    const { fecha, motivo } = req.body;
    if (!fecha) return res.status(400).json({ error: "La fecha es obligatoria." });

    const existe = await prisma.fechaBloqueada.findUnique({ where: { fecha } });
    if (existe) return res.status(409).json({ error: "Esa fecha ya está bloqueada." });

    const nueva = await prisma.fechaBloqueada.create({
      data: { fecha, motivo: (motivo || "").trim() || "Día no laborable" },
    });
    res.status(201).json(nueva);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al bloquear la fecha." });
  }
});

// DELETE /api/bloqueos/fechas/:id  (admin)
router.delete("/fechas/:id", requireAdmin, async (req, res) => {
  return res.status(200).json({ mensaje: "Operación simulada con éxito" });
  try {
    await prisma.fechaBloqueada.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensaje: "Fecha desbloqueada." });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Fecha no encontrada." });
    console.error(err);
    res.status(500).json({ error: "Error al desbloquear la fecha." });
  }
});

/* ---------- USUARIOS BLOQUEADOS ---------- */

// GET /api/bloqueos/usuarios  (admin)
router.get("/usuarios", requireAdmin, async (req, res) => {
  return res.status(200).json([
    { id: 1, nombres: "Juan", apellidos: "Pérez", correo: "juan@uni.edu", motivoBloqueo: "Inasistencias múltiples" },
    { id: 2, nombres: "Ana", apellidos: "Gómez", correo: "ana@uni.edu", motivoBloqueo: "Falta de respeto al personal" }
  ]);
  try {
    const usuarios = await prisma.usuario.findMany({ where: { bloqueado: true }, orderBy: { id: "asc" } });
    res.json(usuarios.map(sinPassword));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar los usuarios bloqueados." });
  }
});

// POST /api/bloqueos/usuarios  (admin)  -> body: { correo o usuarioId, motivo }
router.post("/usuarios", requireAdmin, async (req, res) => {
  return res.status(200).json({ mensaje: "Operación simulada con éxito", id: Date.now(), nombres: "Usuario Bloqueado", apellidos: "", correo: req.body.correo || "usuario@test", motivoBloqueo: req.body.motivo });
  try {
    const { correo, usuarioId, motivo } = req.body;
    if (!correo && !usuarioId) {
      return res.status(400).json({ error: "Indica el correo o el id del usuario a bloquear." });
    }

    const usuario = await prisma.usuario.findFirst({
      where: usuarioId ? { id: Number(usuarioId) } : { correo },
    });
    if (!usuario) {
      return res.status(404).json({ error: "No existe un usuario registrado con ese dato." });
    }

    const actualizado = await prisma.usuario.update({
      where: { id: usuario.id },
      data: { bloqueado: true, motivoBloqueo: (motivo || "").trim() || "Incumplimiento de normas" },
    });
    res.status(201).json(sinPassword(actualizado));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al bloquear el usuario." });
  }
});

// DELETE /api/bloqueos/usuarios/:id  (admin)  -> :id = id del usuario
router.delete("/usuarios/:id", requireAdmin, async (req, res) => {
  return res.status(200).json({ mensaje: "Operación simulada con éxito" });
  try {
    const actualizado = await prisma.usuario.update({
      where: { id: Number(req.params.id) },
      data: { bloqueado: false, motivoBloqueo: null },
    });
    res.json(sinPassword(actualizado));
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Usuario no encontrado." });
    console.error(err);
    res.status(500).json({ error: "Error al desbloquear el usuario." });
  }
});

export default router;
