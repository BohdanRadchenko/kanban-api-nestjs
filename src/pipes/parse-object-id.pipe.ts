import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
	transform(value: any, metadata: ArgumentMetadata): any {
		const isValidId = Types.ObjectId.isValid(value);
		if (!isValidId) {
			throw new BadRequestException(`Invalid ID: ${value}`);
		}
		return value;
	}
}
