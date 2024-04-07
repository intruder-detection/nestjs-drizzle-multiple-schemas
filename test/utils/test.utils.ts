import { INestApplication, Type } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { LoggerUtils } from '@core/logging/utils/logger.utils';
import { Client } from 'pg';
import { DatabaseConfig } from '@core/common/database/config/database.config';
import * as schema from '@core/common/database/entities/entities.schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { CustomLoggingModule } from '@core/logging/custom-logging/custom-logging.module';
import { CustomLoggingService } from '@core/logging/custom-logging/custom-logging.service';
import { sql } from 'drizzle-orm';

export class TestUtils {
  /**
   * Setup the NestJS application with the given modules.
   */
  static async setupApplication(modules: Type<unknown>[] | Type<unknown>) {
    let app: INestApplication | null = await this.createTestApp(modules);

    afterAll(async () => {
      await this.teardownApp(app);
      app = undefined as any;
    });

    return app;
  }

  private static async createTestApp(modules: Type<unknown>[] | Type<unknown>) {
    const testingModule = await this.compileModules(modules);

    const adapter = new FastifyAdapter(LoggerUtils.defaultFastifyAdapterLogger);
    const app = await testingModule.createNestApplication<NestFastifyApplication>(adapter);
    app.useLogger(app.get(CustomLoggingService));
    app.enableCors();

    // Clean up DB (if exists) and run recreate it (running migrations)
    await TestUtils.cleanDB(app);
    await this.setupDB(app);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    return app;
  }

  private static async compileModules(modules: Type<unknown>[] | Type<unknown>) {
    if (!Array.isArray(modules)) {
      modules = [modules,];
    }
    return await Test.createTestingModule({
      imports: [
        // Setup for HTTP. TODO: If an example for microservices is added then change to use httpLoggingOptions or microserviceLoggingOptions
        CustomLoggingModule.forRoot(LoggerUtils.httpLoggingOptions()),
        ...modules,
      ]
    }).compile();
  }

  private static async setupDB(app: INestApplication): Promise<void> {
    const dbConfig = app.get(DatabaseConfig);
    const client = new Client({
      connectionString: dbConfig.postgresqlConnection,
    });
    await client.connect();
    const db = drizzle(client, { schema });
    // Makes sure the connection uses the Schema we want
    const schemaName = dbConfig.schemaName;
    await db.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`));
    await db.execute(sql.raw(`SET schema '${schemaName}'`));
    // This will run migrations on the database, skipping the ones already applied
    await migrate(db, { migrationsFolder: `${__dirname}/../../migrations/src`, migrationsSchema: schemaName });
    await client.end();
  }

  private static async teardownApp(app: INestApplication) {
    app.flushLogs();
    await TestUtils.cleanDB(app);
    await app.close();
  }

  private static async cleanDB(app: INestApplication,): Promise<void> {
    const dbConfig = app.get(DatabaseConfig);
    const client = new Client({
      connectionString: dbConfig.postgresqlConnection,
    });
    await client.connect();
    const db = drizzle(client, { schema });
    // Makes sure the connection uses the DB schema we want
    const schemaName = dbConfig.schemaName;
    await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`))
    await client.end();
  }
}
