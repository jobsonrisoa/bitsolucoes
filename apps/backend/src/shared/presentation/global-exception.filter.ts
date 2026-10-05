import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let errors = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = res.message || exception.message;
      code = res.error || 'HTTP_ERROR';
      errors = Array.isArray(res.message) ? res.message : [];
    } else if (exception.isDomainError) {
      status = exception.status || HttpStatus.BAD_REQUEST;
      message = exception.message;
      code = exception.code;
    }

    const correlationId = request.headers['x-correlation-id'] || request['id'];

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ err: exception, correlationId, url: request.url }, 'Unhandled error');
    }

    response.status(status).json({ statusCode: status, code, message, errors, correlationId });
  }
}