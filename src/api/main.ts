import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ApiModule } from '@api/api.module';
import { ApiConfig } from '@api/config/api.config';
import { LoggerUtils } from '@core/logging/utils/logger.utils';

async function bootstrap() {
  const adapter = new FastifyAdapter({
    ...LoggerUtils.defaultFastifyAdapterLogger,
  });
  const app = await NestFactory.create(ApiModule, adapter);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(app.get(ApiConfig).getApiPortNumber);
}

void bootstrap();
