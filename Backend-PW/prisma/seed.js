// Seed inicial de la base de datos.
// Ejecuta:  npm run seed   (o automáticamente con: npx prisma migrate reset)
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PLATOS = [
  { nombre: "Lomo Saltado", precio: 20.0, imagen: "/imagenes/lomo-saltado.jpg", descripcion: "Trozos de carne salteados con cebolla, tomate, papas fritas y arroz." },
  { nombre: "Ají de Gallina", precio: 15.0, imagen: "/imagenes/aji-gallina.jpg", descripcion: "Pollo deshilachado en cremosa salsa de ají amarillo acompañado de arroz." },
  { nombre: "Tallarines Verdes", precio: 16.0, imagen: "/imagenes/tallarines-verdes.jpg", descripcion: "Pasta en salsa de albahaca servida con bistec a la plancha." },
  { nombre: "Arroz Chaufa", precio: 15.0, descripcion: "Arroz salteado al estilo oriental con pollo, huevo y cebollita china." },
  { nombre: "Pollo a la Brasa", precio: 18.0, descripcion: "Cuarto de pollo acompañado de papas fritas y ensalada fresca." },
  { nombre: "Seco de Res", precio: 19.0, descripcion: "Carne cocida en salsa de culantro acompañada de arroz y frejoles." },
  { nombre: "Causa Limeña", precio: 14.0, descripcion: "Puré de papa amarilla relleno de pollo y mayonesa." },
  { nombre: "Milanesa con Arroz", precio: 16.0, descripcion: "Milanesa de pollo crocante acompañada de arroz y ensalada." },
  { nombre: "Arroz con Pollo", precio: 16.0, descripcion: "Arroz verde preparado con culantro acompañado de presa de pollo." },
  { nombre: "Papa a la Huancaína", precio: 14.0, descripcion: "Papas cocidas cubiertas con una cremosa salsa de queso y ají amarillo." },
  { nombre: "Chanfainita", precio: 15.0, descripcion: "Tradicional guiso peruano acompañado de arroz blanco." },
  { nombre: "Pollo Broaster", precio: 18.0, descripcion: "Pollo empanizado y crocante acompañado de papas fritas." },
  { nombre: "Estofado de Pollo", precio: 17.0, descripcion: "Pollo cocido en salsa de tomate con zanahoria, arvejas y arroz." },
  { nombre: "Chicharrón de Cerdo", precio: 20.0, descripcion: "Trozos de cerdo fritos servidos con camote y salsa criolla." },
  { nombre: "Tallarines Rojos", precio: 15.0, descripcion: "Pasta con salsa de tomate casera acompañada de pollo a la plancha." },
  { nombre: "Bistec a lo Pobre", precio: 19.0, descripcion: "Bistec acompañado de huevo frito, plátano maduro y arroz." },
];

const BLOQUES = [
  { hora: "12:00", etiqueta: "12:00 PM", capacidad: 30 },
  { hora: "12:30", etiqueta: "12:30 PM", capacidad: 30 },
  { hora: "13:00", etiqueta: "01:00 PM", capacidad: 30 },
  { hora: "13:30", etiqueta: "01:30 PM", capacidad: 30 },
  { hora: "14:00", etiqueta: "02:00 PM", capacidad: 30 },
];

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

async function main() {
  console.log("🌱 Sembrando base de datos...");

  // Config de servicio (singleton id=1)
  await prisma.configuracionServicio.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, servicioSuspendido: false },
  });

  // Platos
  for (const p of PLATOS) {
    await prisma.plato.upsert({
      where: { id: PLATOS.indexOf(p) + 1 },
      update: {},
      create: { ...p, tipo: "Carta" },
    });
  }

  // Bloques horarios
  for (const b of BLOQUES) {
    await prisma.bloqueHorario.upsert({
      where: { hora: b.hora },
      update: {},
      create: b,
    });
  }

  // Menú del día (para hoy)
  await prisma.menuDelDia.upsert({
    where: { fecha: hoyISO() },
    update: {},
    create: {
      fecha: hoyISO(),
      entrada: "Ensalada fresca o sopa criolla",
      platoPrincipal: "Arroz chaufa con pollo y papas doradas",
      bebida: "Chicha morada o limonada",
      precio: 12.0,
    },
  });

  // Usuarios demo (contraseña: "123456")
  const hash = await bcrypt.hash("123456", 10);
  await prisma.usuario.upsert({
    where: { correo: "admin@universidad.edu.pe" },
    update: {},
    create: { nombres: "Carlos", apellidos: "Gómez", correo: "admin@universidad.edu.pe", password: hash, rol: "Admin" },
  });
  await prisma.usuario.upsert({
    where: { correo: "juan.perez@universidad.edu.pe" },
    update: {},
    create: { nombres: "Juan", apellidos: "Pérez", correo: "juan.perez@universidad.edu.pe", password: hash, codigoUniversitario: "20261234", rol: "Cliente" },
  });

  console.log("✅ Seed completado. Usuarios demo:");
  console.log("   Admin   -> admin@universidad.edu.pe / 123456");
  console.log("   Cliente -> juan.perez@universidad.edu.pe / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
