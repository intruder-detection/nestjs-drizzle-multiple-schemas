import { DynamicModule, INestApplication, Type } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { LoggerUtils } from '@core/logging/utils/logger.utils';
import { DatabaseConfig } from '@core/common/database/config/database.config';
import { CustomLoggingModule } from '@core/logging/custom-logging/custom-logging.module';
import { CustomLoggingService } from '@core/logging/custom-logging/custom-logging.service';
import { DatabaseHelper } from '@core/common/database/helpers/database.helper';

export class TestUtils {
  /**
   * Setup the NestJS application with the given modules.
   */
  static async setupHttpContextApplication(modules: Type<unknown>[] | Type<unknown>, customSchemaName?: string) {
    this.setupTestEnvVariables(customSchemaName)
    let app: INestApplication | null = await this.createTestApp([
      CustomLoggingModule.forRoot(LoggerUtils.httpLoggingOptions()),
      ...(Array.isArray(modules) ? modules : [modules]),
    ]);

    afterAll(async () => {
      await this.teardownApp(app);
      app = undefined as any;
    });

    return app;
  }

  static setupTestEnvVariables(customSchemaName?: string) {
    // check test docker-compose for the DB env variables
    process.env.DB_USER = 'drizzle-orm';
    process.env.DB_PASSWORD = 'pass';
    process.env.DB_HOST_NAME = 'localhost';
    process.env.DB_PORT = '5432';
    process.env.DB_NAME = 'drizzle-orm';
    /**
     * Each schema will have their own unique identifier (test1, test2, etc), allowing each test data to be contained on their own schema.
     * If you want, you can pass a custom name for your schema
     */
    process.env.DB_SCHEMA_NAME = customSchemaName ?? `test${process.env.VITEST_POOL_ID}`;
  }

  private static async createTestApp(modules: (DynamicModule | Type<unknown>)[]) {
    const testingModule = await this.compileModules(modules);

    const adapter = new FastifyAdapter(LoggerUtils.defaultFastifyAdapterLogger);
    const app = await testingModule.createNestApplication<NestFastifyApplication>(adapter);
    app.useLogger(app.get(CustomLoggingService));
    app.enableCors();

    // Clean up DB (if exists) and run recreate it (running migrations)
    await TestUtils.cleanDB();
    await this.setupDB();

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    return app;
  }

  private static async compileModules(modules: (DynamicModule | Type<unknown>)[]) {
    return await Test.createTestingModule({
      imports: modules,
    }).compile();
  }

  private static async setupDB(): Promise<void> {
    const [connectionString, schemaName] = [DatabaseConfig.postgresqlConnection, DatabaseConfig.schemaName];
    await DatabaseHelper.runMigrations(`${__dirname}/../../migrations/src`, connectionString, schemaName);
  }

  private static async teardownApp(app: INestApplication) {
    app.flushLogs();
    await TestUtils.cleanDB();
    await app.close();
  }

  private static async cleanDB(): Promise<void> {
    await DatabaseHelper.cleanSchema(DatabaseConfig.postgresqlConnection, DatabaseConfig.schemaName);
  }
}
