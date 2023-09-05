import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AbstractEntity } from './abstract.entity';
import { Board } from './board.entity';
import { Card } from './card.entity';

@Schema()
export class List extends AbstractEntity {
	@Prop()
	title: string;
	@Prop()
	pos: number;
	@Prop({ type: Types.ObjectId, ref: 'Board', required: true })
	board: Board['_id'];
	// @Prop([{ type: Types.ObjectId, ref: Card.name }])
	@Prop([{ type: Card }])
	cards: Card[];
}

export type ListDocument = HydratedDocument<List>;

export const ListSchema = SchemaFactory.createForClass(List);
