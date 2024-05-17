import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggingConfig {
  constructor(private configService: ConfigService) {}

  get trackingIdHeader(): string {
    return this.configService.get<string>('TRACKING_ID_HEADER');
  }

  static validateConfiguration() {
    const envSchema = z.object({
      // Tracking id header
      TRACKING_ID_HEADER: z.coerce.string().optional(),
    });

    return envSchema.parse(process.env);
  }
}
