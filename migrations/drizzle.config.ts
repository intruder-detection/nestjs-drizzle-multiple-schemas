import 'dotenv/config';
import * as path from 'node:path';
import { Config, defineConfig } from 'drizzle-kit';
import { z } from 'zod';

// TODO: Find a way to load the DatabaseConfig to avoid code duplication
// NOTICE: This 2 methods were copy-pasted from DatabaseConfig class, since currently drizzle-kit can't deal with decorators
function validateConfiguration() {
  const envSchema = z.object({
    DB_USER: z.coerce.string().min(1),
    DB_PASSWORD: z.coerce.string().min(1),
    DB_HOST_NAME: z.coerce.string().min(1),
    DB_PORT: z.coerce.number().positive(),
    // Name of the database
    DB_NAME: z.coerce.string().min(1),
    // Name of the schema to use
    DB_SCHEMA_NAME: z.coerce.string().min(1),
  });

  return envSchema.parse(process.env);
}
const config = validateConfiguration();

function postgresqlConnection(): string {
  return `postgres://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST_NAME}:${config.DB_PORT}/${config.DB_NAME}`;
}

// See: https://orm.drizzle.team/kit-docs/commands
export default defineConfig({
  schema: `${__dirname}/../src/core/common/database/entities/**/*.entity.ts`,
  out: path.relative(process.cwd(), 'src'),
  verbose: true,
  driver: 'pg',
  schemaFilter: config.DB_SCHEMA_NAME,
  dbCredentials: {
    connectionString: postgresqlConnection(),
  },
} satisfies Config);
