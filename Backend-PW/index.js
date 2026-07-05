import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/auth.js";
import platosRoutes from "./src/routes/platos.js";
import menuDiaRoutes from "./src/routes/menuDia.js";
import horariosRoutes from "./src/routes/horarios.js";
import reservasRoutes from "./src/routes/reservas.js";
import bloqueosRoutes from "./src/routes/bloqueos.js";
import servicioRoutes from "./src/routes/servicio.js";
import reportesRoutes from "./src/routes/reportes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck
app.get("/api/health", (req, res) => res.json({ ok: true, servicio: "API Comedor NOSE" }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/platos", platosRoutes);
app.use("/api/menu-dia", menuDiaRoutes);
app.use("/api/horarios", horariosRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/bloqueos", bloqueosRoutes);
app.use("/api/servicio", servicioRoutes);
app.use("/api/reportes", reportesRoutes);

// 404 para rutas de API no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
