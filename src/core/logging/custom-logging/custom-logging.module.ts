import { DynamicModule, Module } from '@nestjs/common';
import { PrettyOptions } from 'pino-pretty';
import { CustomDrizzleLoggingService } from '@core/logging/custom-logging/custom-drizzle-logging.service';
import { CUSTOM_LOGGING_OPTIONS_PROVIDER } from '@core/logging/custom-logging/custom-logging-options.interface';
import { CustomLoggingService } from '@core/logging/custom-logging/custom-logging.service';

@Module({})
export class CustomLoggingModule {
  static forRoot(loggingOptions: PrettyOptions): DynamicModule {
    return {
      module: CustomLoggingModule,
      providers: [
        {
          provide: CUSTOM_LOGGING_OPTIONS_PROVIDER,
          useValue: loggingOptions,
        },
        CustomLoggingService,
        CustomDrizzleLoggingService,
      ],
      exports: [CustomLoggingService, CustomDrizzleLoggingService],
    };
  }
}
