import { Router } from "express";
import prisma from "../prismaClient.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/platos           -> solo disponibles
// GET /api/platos?todos=true -> todos (para el panel admin)
router.get("/", async (req, res) => {
  return res.status(200).json([
    { id: 1, nombre: 'Lomo Saltado', precio: 20.00, descripcion: 'Trozos de carne salteados con cebolla, tomate, papas fritas y arroz.', imagen: '/imagenes/lomo-saltado.jpg', disponible: true, tipo: 'Carta' },
    { id: 2, nombre: 'Ají de Gallina', precio: 15.00, descripcion: 'Pollo deshilachado en cremosa salsa de ají amarillo acompañado de arroz.', imagen: '/imagenes/aji-gallina.jpg', disponible: true, tipo: 'Carta' },
    { id: 3, nombre: 'Tallarines Verdes', precio: 16.00, descripcion: 'Pasta en salsa de albahaca servida con bisteck a la plancha.', imagen: '/imagenes/tallarines-verdes.jpg', disponible: true, tipo: 'Carta' }
  ]);

  try {
    const todos = req.query.todos === "true";
    const where = todos ? {} : { disponible: true };
    const platos = await prisma.plato.findMany({ where, orderBy: { id: "asc" } });
    res.json(platos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar los platos." });
  }
});

// GET /api/platos/:id
router.get("/:id", async (req, res) => {
  return res.status(200).json({ 
    id: Number(req.params.id), 
    nombre: 'Lomo Saltado', 
    precio: 20.00, 
    descripcion: 'Trozos de carne salteados con cebolla, tomate, papas fritas y arroz.', 
    imagen: '/imagenes/lomo-saltado.jpg', 
    disponible: true, 
    tipo: 'Carta' 
  });

  try {
    const plato = await prisma.plato.findUnique({ where: { id: Number(req.params.id) } });
    if (!plato) return res.status(404).json({ error: "Plato no encontrado." });
    res.json(plato);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el plato." });
  }
});

// POST /api/platos  (admin)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, tipo, imagen, disponible } = req.body;
    if (!nombre || precio == null) {
      return res.status(400).json({ error: "El nombre y el precio son obligatorios." });
    }
    const plato = await prisma.plato.create({
      data: {
        nombre,
        descripcion: descripcion ?? "",
        precio: Number(precio),
        tipo: tipo ?? "Carta",
        imagen: imagen ?? null,
        disponible: disponible ?? true,
      },
    });
    res.status(201).json(plato);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el plato." });
  }
});

// PUT /api/platos/:id  (admin)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, tipo, imagen, disponible } = req.body;
    const plato = await prisma.plato.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(precio !== undefined && { precio: Number(precio) }),
        ...(tipo !== undefined && { tipo }),
        ...(imagen !== undefined && { imagen }),
        ...(disponible !== undefined && { disponible }),
      },
    });
    res.json(plato);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Plato no encontrado." });
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el plato." });
  }
});

// DELETE /api/platos/:id  (admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.plato.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensaje: "Plato eliminado." });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Plato no encontrado." });
    if (err.code === "P2003")
      return res.status(409).json({ error: "No se puede eliminar: el plato tiene reservas asociadas." });
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el plato." });
  }
});

export default router;
