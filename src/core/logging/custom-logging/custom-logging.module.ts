import { DynamicModule, Module } from '@nestjs/common';
import { PrettyOptions } from 'pino-pretty';
import { ClsModule, ClsService } from 'nestjs-cls';
import { CustomDrizzleLoggingService } from '@core/logging/custom-logging/custom-drizzle-logging.service';
import { CUSTOM_LOGGING_OPTIONS_PROVIDER } from '@core/logging/custom-logging/custom-logging-options.interface';
import { CustomLoggingService } from '@core/logging/custom-logging/custom-logging.service';
import { LoggerUtils } from '@core/logging/utils/logger.utils';
import { ConfigModule } from '@nestjs/config';
import { LoggingConfig } from '@core/logging/config/logging.config';

@Module({})
export class CustomLoggingModule {
  static forRoot(loggingOptions: PrettyOptions): DynamicModule {
    return {
      module: CustomLoggingModule,
      providers: [
        LoggingConfig,
        {
          provide: CUSTOM_LOGGING_OPTIONS_PROVIDER,
          useValue: loggingOptions,
        },
        CustomLoggingService,
        CustomDrizzleLoggingService,
      ],
      imports: [
        ConfigModule.forRoot({
          validate: LoggingConfig.validateConfiguration,
        }),
        // SEE: https://papooch.github.io/nestjs-cls/api/module-options
        ClsModule.forRoot({
          global: true,
          middleware: {
            // automatically mount the ClsMiddleware for all routes
            mount: true,
            generateId: true,
            idGenerator: (req) => LoggerUtils.generateLoggingIdForHttpContext(req),
            setup: (cls: ClsService, req, res) => {
              cls.set('startTime', new Date().getTime());
            },
            // We don't need the req/res in to be stored in the store
            saveReq: false,
            saveRes: false,
          },
        }),
      ],
      exports: [CustomLoggingService, CustomDrizzleLoggingService],
    };
  }
}
