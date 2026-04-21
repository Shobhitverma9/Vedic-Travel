import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    // LOG THE ACTUAL ERROR FOR CLOUD RUN
    const detailedMessage = exception instanceof HttpException ? exception.getResponse() : null;
    this.logger.error(`Exception caught for ${responseBody.path}:`);
    if (detailedMessage) {
        this.logger.error('Detailed Error Response:', JSON.stringify(detailedMessage, null, 2));
    }
    this.logger.error(exception instanceof Error ? exception.stack : exception);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
