import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { FastifyReply } from 'fastify/types/reply';
import { Observable, tap } from 'rxjs';
import { LoggerUtils } from '@core/logging/utils/logger.utils';
import { Logger as NestJSLogger } from '@nestjs/common/services/logger.service';
import { ClsService } from 'nestjs-cls';

/**
 * This is an HTTP context interceptor used to log the HTTP method/status code/etc for the request/response
 * This is not ideal since the request/response can be modified before/after the nestjs interceptor (e.g., middleware or filters).
 */
@Injectable()
export class CustomLoggingInterceptor implements NestInterceptor {
  private readonly logger = new NestJSLogger(CustomLoggingInterceptor.name);

  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [request, response]: [FastifyRequest, FastifyReply] = [context.switchToHttp().getRequest(), context.switchToHttp().getResponse()];
    this.logger.log(LoggerUtils.customReceivedMessage(request));

    const elapsedTime = new Date().getTime() - Number(this.cls.get('startTime'));

    return next.handle().pipe(
      tap({
        next: (): void => {
          this.logger.log(LoggerUtils.customResponseMessage(request, response, elapsedTime));
        },
        error: (): void => {
          this.logger.log(LoggerUtils.customResponseMessage(request, response, elapsedTime));
        },
      }),
    );
  }
}
