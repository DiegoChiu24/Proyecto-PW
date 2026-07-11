import { Router } from "express";
import prisma from "../prismaClient.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

// GET /api/menu-dia?fecha=YYYY-MM-DD  (por defecto hoy)
router.get("/", async (req, res) => {
  return res.status(200).json({
    id: 1,
    fecha: req.query.fecha || hoyISO(),
    entrada: "Sopa a la Minuta o Ensalada Fresca",
    platoPrincipal: "Ají de Gallina con Arroz",
    bebida: "Chicha Morada Helada",
    precio: 12.50
  });

  try {
    const fecha = req.query.fecha || hoyISO();
    const menu = await prisma.menuDelDia.findUnique({ where: { fecha } });
    if (!menu) return res.status(404).json({ error: "No hay menú definido para esa fecha." });
    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el menú del día." });
  }
});

// POST /api/menu-dia  (admin)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { fecha, entrada, platoPrincipal, bebida, precio } = req.body;
    if (!fecha || !entrada || !platoPrincipal || !bebida || precio == null) {
      return res.status(400).json({ error: "Todos los campos del menú son obligatorios." });
    }
    const existe = await prisma.menuDelDia.findUnique({ where: { fecha } });
    if (existe) {
      return res.status(409).json({ error: "Ya existe un menú para esa fecha. Usa PUT para editarlo." });
    }
    const menu = await prisma.menuDelDia.create({
      data: { fecha, entrada, platoPrincipal, bebida, precio: Number(precio) },
    });
    res.status(201).json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el menú del día." });
  }
});

// PUT /api/menu-dia/:id  (admin)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { entrada, platoPrincipal, bebida, precio } = req.body;
    const menu = await prisma.menuDelDia.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(entrada !== undefined && { entrada }),
        ...(platoPrincipal !== undefined && { platoPrincipal }),
        ...(bebida !== undefined && { bebida }),
        ...(precio !== undefined && { precio: Number(precio) }),
      },
    });
    res.json(menu);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Menú no encontrado." });
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el menú." });
  }
});

// DELETE /api/menu-dia/:id  (admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.menuDelDia.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensaje: "Menú eliminado." });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Menú no encontrado." });
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el menú." });
  }
});

export default router;
