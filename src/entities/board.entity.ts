import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AbstractEntity } from './abstract.entity';

@Schema()
export class Board extends AbstractEntity {
	@Prop()
	title: string;
}

export type BoardDocument = HydratedDocument<Board>;

export const BoardSchema = SchemaFactory.createForClass(Board);
