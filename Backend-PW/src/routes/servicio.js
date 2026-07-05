import { Router } from "express";
import prisma from "../prismaClient.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// Asegura que exista la fila única de configuración (id=1).
async function obtenerConfig() {
  let config = await prisma.configuracionServicio.findUnique({ where: { id: 1 } });
  if (!config) {
    config = await prisma.configuracionServicio.create({ data: { id: 1, servicioSuspendido: false } });
  }
  return config;
}

// GET /api/servicio/estado  (público: la vista de reserva lo consulta)
router.get("/estado", async (req, res) => {
  try {
    const config = await obtenerConfig();
    res.json({ servicioSuspendido: config.servicioSuspendido });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar el estado del servicio." });
  }
});

// PATCH /api/servicio/estado  (admin)  -> { servicioSuspendido: true }
router.patch("/estado", requireAdmin, async (req, res) => {
  try {
    const { servicioSuspendido } = req.body;
    await obtenerConfig();
    const config = await prisma.configuracionServicio.update({
      where: { id: 1 },
      data: { servicioSuspendido: Boolean(servicioSuspendido) },
    });
    res.json({ servicioSuspendido: config.servicioSuspendido });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cambiar el estado del servicio." });
  }
});

export default router;
