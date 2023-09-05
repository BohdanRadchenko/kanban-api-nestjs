import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export abstract class AbstractEntity extends Document {
	@Prop({ default: Date.now })
	createdAt?: Date;

	@Prop()
	updatedAt?: Date;
}
