import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export abstract class AbstractEntity {
	_id: Types.ObjectId;

	@Prop()
	__v: number;

	@Prop()
	createdAt?: Date;

	@Prop()
	updatedAt?: Date;
}
