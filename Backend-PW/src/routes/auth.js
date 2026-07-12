import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prismaClient.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function sinPassword(u) {
  const { password, ...resto } = u;
  return resto;
}

router.post("/register/cliente", async (req, res) => {
  try {
    const { nombres, apellidos, codigoUniversitario, correo, password } = req.body;
    if (!nombres || !apellidos || !correo || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const existe = await prisma.usuario.findUnique({ where: { correo } });
    if (existe) {
      return res.status(409).json({ error: "El correo ya está registrado." });
    }

    const hash = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: { nombres, apellidos, codigoUniversitario, correo, password: hash, rol: "Cliente" },
    });

    res.status(201).json(sinPassword(usuario));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar el cliente." });
  }
});

router.post("/register/admin", async (req, res) => {
  try {
    const { nombres, apellidos, correo, password, keyEncargado } = req.body;
    if (!nombres || !apellidos || !correo || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }
    if (keyEncargado !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: "La clave del encargado no es válida." });
    }

    const existe = await prisma.usuario.findUnique({ where: { correo } });
    if (existe) {
      return res.status(409).json({ error: "El correo ya está registrado." });
    }

    const hash = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: { nombres, apellidos, correo, password: hash, rol: "Admin" },
    });

    res.status(201).json(sinPassword(usuario));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar el administrador." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
    }

    const usuario = await prisma.usuario.findUnique({ where: { correo } });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    if (usuario.bloqueado) {
      return res.status(403).json({ error: "Tu cuenta está bloqueada. Contacta al comedor." });
    }

    res.json(sinPassword(usuario));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json(sinPassword(req.usuario));
});

router.get("/perfil", (req, res) => {
  res.status(200).json({
    nombres: "Juan",
    apellidos: "Pérez",
    correo: "juan@test.com",
    telefono: "999888777",
  });
});

router.put("/perfil", (req, res) => {
  res.status(200).json({ mensaje: "Perfil actualizado correctamente" });
});

router.post("/logout", (req, res) => {
  res.json({ mensaje: "Sesión finalizada." });
});

export default router;
