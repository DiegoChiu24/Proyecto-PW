import prisma from "../prismaClient.js";

// Lee el header "x-user-id" y adjunta el usuario a req.usuario.
// El frontend envía este header con el id guardado en sessionStorage tras el login.
export async function requireAuth(req, res, next) {
  try {
    const userId = req.header("x-user-id");
    if (!userId) {
      return res.status(401).json({ error: "No autenticado. Falta el header x-user-id." });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(userId) },
    });

    if (!usuario) {
      return res.status(401).json({ error: "Usuario no válido." });
    }

    req.usuario = usuario;
    next();
  } catch (err) {
    console.error("Error en requireAuth:", err);
    res.status(500).json({ error: "Error al validar la sesión." });
  }
}

// Requiere que el usuario autenticado tenga rol Admin.
export async function requireAdmin(req, res, next) {
  await requireAuth(req, res, () => {
    if (req.usuario.rol !== "Admin") {
      return res.status(403).json({ error: "Acceso restringido a administradores." });
    }
    next();
  });
}
