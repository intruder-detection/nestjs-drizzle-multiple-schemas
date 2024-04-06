import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from '@core/common/database/database.module';
import { JobDao } from '@core/common/database/entities/job/job.dao';
import { CustomLoggingService } from '@core/logging/custom-logging/custom-logging.service';

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(DatabaseModule);
  const logger = app.get(CustomLoggingService);
  app.useLogger(logger);
  await app.init();
  logger.log(`Starting Database Module tests`);

  const jobsDao = app.get(JobDao);
  const allJobs = await jobsDao.getAll();
  console.log(allJobs[0]);

  const jobId: string = '9a974afa-50da-4b64-88d4-e737a8d7c64c';
  const byId = await jobsDao.getById(jobId, ['id', 'name']);
  console.log(byId);

  const xx = await jobsDao.getOneBySingleKey('id', jobId, ['id', 'name']);
  console.log(xx);

  const yy = await jobsDao.getOneById(jobId, ['id', 'name']);
  console.log(yy);
}

void bootstrap();
