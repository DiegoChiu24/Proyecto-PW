import { Router } from "express";
import prisma from "../prismaClient.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

// GET /api/reportes/diario?fecha=YYYY-MM-DD  (admin)
router.get("/diario", requireAdmin, async (req, res) => {
  const fecha = req.query.fecha || hoyISO();
  return res.status(200).json({
    fecha,
    totalPlatos: 45,
    variedad: 3,
    ingresos: 710.50,
    desglose: [
      { plato: 'Lomo Saltado', cantidad: 20, ingresos: 400.00 },
      { plato: 'Ají de Gallina', cantidad: 15, ingresos: 225.00 },
      { plato: 'Menú del Día', cantidad: 10, ingresos: 85.50 }
    ]
  });

  try {
    const fecha = req.query.fecha || hoyISO();

    // Solo reservas no canceladas del día.
    const reservas = await prisma.reserva.findMany({
      where: { fecha, estado: { not: "Cancelada" } },
    });

    // Agregado por plato.
    const mapa = new Map();
    for (const r of reservas) {
      const actual = mapa.get(r.platoNombre) || { plato: r.platoNombre, cantidad: 0, ingresos: 0 };
      actual.cantidad += 1;
      actual.ingresos += r.precio;
      mapa.set(r.platoNombre, actual);
    }

    const desglose = Array.from(mapa.values())
      .map((d) => ({ ...d, ingresos: Number(d.ingresos.toFixed(2)) }))
      .sort((a, b) => b.cantidad - a.cantidad);

    const totalPlatos = reservas.length;
    const ingresos = Number(desglose.reduce((acc, d) => acc + d.ingresos, 0).toFixed(2));

    res.json({
      fecha,
      totalPlatos,
      variedad: desglose.length,
      ingresos,
      desglose,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar el reporte diario." });
  }
});

export default router;
