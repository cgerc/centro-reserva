// prisma.config.ts
import 'dotenv/config';  // Carga tu .env automáticamente
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),  // Usa tu DATABASE_URL de .env
  },
});