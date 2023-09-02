import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';

@Schema()
export class Board extends AbstractEntity {
	@Prop()
	title: string;

	@Prop({ type: Types.ObjectId, ref: User.name })
	owner: User['_id'];

	@Prop([{ type: Types.ObjectId, ref: User.name }])
	access: Array<User['_id']>;
}

export type BoardDocument = HydratedDocument<Board>;

export const BoardSchema = SchemaFactory.createForClass(Board);
