import { Injectable, Logger as NestJSLogger } from '@nestjs/common';
import { Logger } from 'drizzle-orm/logger';

/**
 * Custom Drizzle logger that logs the interpolated queries. This is quite useful to have the query ready to copy-paste into Datagrip/DBeaver/etc
 */
@Injectable()
export class CustomDrizzleLoggingService implements Logger {
  private readonly logger = new NestJSLogger(CustomDrizzleLoggingService.name);

  logQuery(query: string, params: unknown[]): void;
  logQuery(query: string, params: unknown[]): void;
  logQuery(query: string, params: unknown[]): void {
    const interpolatedQuery = this.interpolateQuery(query, params);
    this.logger.log(interpolatedQuery);
  }

  private interpolateQuery(query: string, parameters?: any[]) {
    if (parameters && parameters.length) {
      parameters.forEach((parameter, index) => {
        query = query.replace(new RegExp(`\\$${index + 1}`), `'${typeof parameter === 'object' ? JSON.stringify(parameter) : parameter}'`);
      });
    }
    return query;
  }
}
