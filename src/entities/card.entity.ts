import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AbstractEntity } from './abstract.entity';

export class Card extends AbstractEntity {
	@Prop()
	description: string;
	@Prop()
	pos: number;
}

export type CardDocument = HydratedDocument<Card>;

export const CardSchema = SchemaFactory.createForClass(Card);
