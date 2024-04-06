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
  app.enableCors();
  const apiConfig = app.get(ApiConfig);
  app.setGlobalPrefix(apiConfig.globalPrefix);
  await app.listen(apiConfig.getApiPortNumber);
}

void bootstrap();
