import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DatabaseConfig } from '@core/common/database/config/database.config';
import { PG_CONNECTION } from '@core/common/database/drizzle/pg-connection';
import { EntitiesSchema } from '@core/common/database/entities/entities.schema';
import { CustomDrizzleLoggingService } from '@core/logging/custom-logging/custom-drizzle-logging.service';

/**
 * Module responsible to create the connection pool to the database.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: DatabaseConfig.validateConfiguration,
    }),
  ],
  providers: [
    DatabaseConfig,
    {
      provide: PG_CONNECTION,
      inject: [DatabaseConfig],
      useFactory: async (dbConfig: DatabaseConfig) => {
        // https://orm.drizzle.team/docs/get-started-postgresql#node-postgres
        const pool = new Pool({
          connectionString: dbConfig.postgresqlConnection,
        });
        return drizzle(pool, { schema: EntitiesSchema, logger: new CustomDrizzleLoggingService() });
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
