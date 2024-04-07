import { INestApplication, Type } from '@nestjs/common';
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
    await TestUtils.cleanDB();
    await this.setupDB();

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    return app;
  }

  private static async compileModules(modules: Type<unknown>[] | Type<unknown>) {
    if (!Array.isArray(modules)) {
      modules = [modules];
    }
    return await Test.createTestingModule({
      imports: [
        // Setup for HTTP. TODO: If an example for microservices is added then change to use httpLoggingOptions or microserviceLoggingOptions
        CustomLoggingModule.forRoot(LoggerUtils.httpLoggingOptions()),
        ...modules,
      ],
    }).compile();
  }

  private static async setupDB(): Promise<void> {
    await DatabaseHelper.runMigrations(`${__dirname}/../../migrations/src`, DatabaseConfig.postgresqlConnection, DatabaseConfig.schemaName);
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
