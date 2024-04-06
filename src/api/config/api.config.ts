import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

@Injectable()
export class ApiConfig {
  constructor(private configService: ConfigService) {}

  get getApiPortNumber(): string {
    return this.configService.get<string>('API_PORT');
  }

  static validateConfiguration() {
    const envSchema = z.object({
      // Port number
      API_PORT: z.coerce.number().positive().default(7979),
    });

    return envSchema.parse(process.env);
  }
}
