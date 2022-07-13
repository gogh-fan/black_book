import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

type IError = string | { error: string; statusCode: number; message: string };

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse() as IError;

    if (typeof error === 'string') {
      response.status(status).json({
        success: false,
        data: null,
        error: { message: error, statusCode: status },
      });
    } else {
      response.status(status).json({
        success: false,
        data: null,
        error: { message: error.message, statusCode: error.statusCode },
      });
    }
  }
}
