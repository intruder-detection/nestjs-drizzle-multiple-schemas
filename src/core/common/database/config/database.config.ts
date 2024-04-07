import { Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class DatabaseConfig {
  get postgresqlConnection(): string {
    return DatabaseConfig.postgresqlConnection;
  }

  get schemaName(): string {
    return DatabaseConfig.schemaName;
  }

  // Same as postgresqlConnection but allows to be used outside of NestJS context
  static get postgresqlConnection(): string {
    const config = DatabaseConfig.validateConfiguration();
    return `postgres://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST_NAME}:${config.DB_PORT}/${config.DB_NAME}`;
  }

  static get schemaName(): string {
    const config = DatabaseConfig.validateConfiguration();
    return config.DB_SCHEMA_NAME;
  }

  static validateConfiguration() {
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
}
