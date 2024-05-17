import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { BaseLogger } from 'pino';
import { PrettyOptions } from 'pino-pretty';
import { CUSTOM_LOGGING_OPTIONS_PROVIDER } from '@core/logging/custom-logging/custom-logging-options.interface';
import { LoggerUtils } from '@core/logging/utils/logger.utils';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class CustomLoggingService implements LoggerService {
  private readonly logger: BaseLogger;

  constructor(
    @Inject(CUSTOM_LOGGING_OPTIONS_PROVIDER) private options: PrettyOptions,
    private readonly cls: ClsService,
  ) {
    this.logger = LoggerUtils.pinoPrettyLogger(options);
  }

  debug(message: any, context?: string): any {
    this.logger.debug(this.buildLoggingMessage(message, context));
  }

  error(message: any, stack?: string, context?: string): any {
    this.logger.error(this.buildLoggingMessage(message, context), stack);
  }

  log(message: any, context?: string): any {
    this.logger.info(this.buildLoggingMessage(message, context));
  }

  verbose(message: any, context?: string): any {
    this.logger.trace(this.buildLoggingMessage(message, context));
  }

  warn(message: any, context?: string): any {
    this.logger.warn(this.buildLoggingMessage(message, context));
  }

  fatal(message: any, context?: string): any {
    this.logger.fatal(this.buildLoggingMessage(message, context));
  }

  private buildLoggingMessage(message: any, context?: string) {
    return {
      msg: message,
      context,
      reqId: this.cls.getId(),
    };
  }
}
