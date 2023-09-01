import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const statusCode = exception.getStatus();
		const exceptionResponse = exception.getResponse() as unknown as { message: string | string[]; errors?: string[] };
		const message = exceptionResponse?.message || exception.message;

		const resBody = {
			timestamp: new Date().toISOString(),
			path: request.url,
			statusCode,
			message
		};

		if (!!exceptionResponse && !!exceptionResponse.errors) {
			resBody['errors'] = exceptionResponse.errors;
		}

		console.log('resBody', resBody);

		response.status(statusCode).json(resBody);
	}
}
