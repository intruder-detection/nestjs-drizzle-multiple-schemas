import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import { FastifyServerOptions } from 'fastify';
import pino, { BaseLogger } from 'pino';
import pretty, { PrettyOptions } from 'pino-pretty';

export class LoggerUtils {
  static get defaultFastifyAdapterLogger(): FastifyServerOptions {
    return {
      logger: false,
      genReqId: (req) => LoggerUtils.generateLoggingIdForHttpContext(req),
    };
  }

  /**
   * Uses the TRACKING_ID_HEADER, if present, otherwise generates a random UUID.
   */
  static generateLoggingIdForHttpContext(req: IncomingMessage): string {
    // TODO: Get TRACKING_ID_HEADER from config
    return  (req?.headers?.[process.env.TRACKING_ID_HEADER] as string) || randomUUID();
  }

  static pinoPrettyLogger(options?: PrettyOptions): BaseLogger {
    const pinoPrettyOptions = {
      ...LoggerUtils.basePinoPrettyOptions(),
      ...(options ?? {}),
    };
    return pino(pretty(pinoPrettyOptions));
  }

  static microserviceLoggingOptions(): PrettyOptions {
    return {
      sync: true,
      minimumLevel: 'debug',
    } satisfies PrettyOptions;
  }

  static httpLoggingOptions(): PrettyOptions {
    return {
      sync: false,
      minimumLevel: 'debug',
    } satisfies PrettyOptions;
  }

  private static basePinoPrettyOptions(): PrettyOptions {
    return {
      minimumLevel: 'info',
      singleLine: true,
      translateTime: true,
      // Useful to increase readability (fewer chars to read), for example, in AWS Cloudwatch/Google Logs/Azure...
      colorize: true,
      levelFirst: true,
      ignore: 'pid,hostname,req,res,reqId,responseTime,context',
      messageFormat: `[{context}] {msg}`,
      sync: true,
    };
  }
}
