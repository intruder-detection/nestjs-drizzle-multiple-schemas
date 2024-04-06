import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiConfig } from '@api/config/api.config';
import { CustomLoggingModule } from '@core/logging/custom-logging/custom-logging.module';
import { LoggerUtils } from '@core/logging/utils/logger.utils';
import { JobsModule } from '@api/modules/jobs/jobs.module';

@Module({
  providers: [ApiConfig],
  imports: [
    CustomLoggingModule.forRoot(LoggerUtils.httpLoggingOptions()),
    ConfigModule.forRoot({
      validate: ApiConfig.validateConfiguration,
    }),
    JobsModule,
  ],
})
export class ApiModule {}
