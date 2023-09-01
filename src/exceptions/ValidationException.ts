import { BadRequestException, HttpExceptionOptions, ValidationError } from '@nestjs/common';

interface ITransformException {
	message: string;
}

const transformException = (errors: ValidationError[]): ITransformException => {
	console.log('errors', errors);
	return {
		message: 'Validation exception'
	};
};

export class ValidationException extends BadRequestException {
	constructor(objectOrError: any, descriptionOrOptions?: string | HttpExceptionOptions) {
		// if (objectOrError instanceof Array<ValidationError>) {
		// 	super(transformException(objectOrError), descriptionOrOptions);
		// 	return;
		// }
		super(objectOrError, descriptionOrOptions);
	}
}
