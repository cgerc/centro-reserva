import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: {
    kind: 'file',
    filePath: 'prisma/schema.prisma',
  },
  datasource: {
    // Aquí es donde Prisma 7 busca la conexión ahora
    url: process.env.DATABASE_URL,
  },
});