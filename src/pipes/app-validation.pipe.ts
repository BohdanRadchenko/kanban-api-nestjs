import { ValidationError, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ValidationException } from '../exceptions';

export class AppValidationPipe extends ValidationPipe {
	constructor(options?: ValidationPipeOptions) {
		super({
			exceptionFactory: (errors: ValidationError[]) => new ValidationException(errors),
			...options,
			transform: true,
			whitelist: true
		});
	}
}
