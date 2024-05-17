import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import { FastifyRequest, FastifyServerOptions } from 'fastify';
import pino, { BaseLogger } from 'pino';
import pretty, { PrettyOptions } from 'pino-pretty';
import { FastifyReply } from 'fastify/types/reply';

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
      messageFormat: `[{reqId}] {msg} [{context}]`,
      sync: true,
    };
  }

  static customReceivedMessage(req: FastifyRequest): string {
    return `---> ${req.method} to '${req.originalUrl}'`;
  }

  static customResponseMessage(req: FastifyRequest, res: FastifyReply, elapsedTime?: number, statusCode?: number): string {
    return `<--- ${req.method} to '${req.originalUrl}' - ${statusCode ?? res.statusCode} after ${Math.ceil(elapsedTime ?? res.elapsedTime)}ms`;
  }
}
