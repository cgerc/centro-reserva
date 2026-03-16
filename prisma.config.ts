// prisma.config.ts
import 'dotenv/config';  // Carga tu .env automáticamente

export default {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL  // ← debe ser "datasource" y "url" exactamente así
  }
};