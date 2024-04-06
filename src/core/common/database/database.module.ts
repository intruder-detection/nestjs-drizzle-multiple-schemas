import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from '@core/common/database/config/database.config';
import { DrizzleModule } from '@core/common/database/drizzle/drizzle.module';
import { JobDao } from '@core/common/database/entities/job/job.dao';

const DAOs = [JobDao];

@Module({
  providers: [...DAOs, DatabaseConfig],
  imports: [
    ConfigModule.forRoot({
      validate: DatabaseConfig.validateConfiguration,
    }),
    DrizzleModule,
  ],
  exports: DAOs,
})
export class DatabaseModule {}
