import { PrismaClient } from "@prisma/client";

// Instancia única de Prisma reutilizada por toda la app.
const prisma = new PrismaClient();

export default prisma;
