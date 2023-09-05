import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, model, Types } from 'mongoose';
import { AbstractEntity } from './abstract.entity';
import { List, ListSchema } from './list.entity';
import { User } from './user.entity';

// @Schema({ _id: false })
@Schema()
export class Board extends AbstractEntity {
	@Prop({ required: true })
	title: string;

	@Prop({ type: Types.ObjectId, ref: User.name, required: true })
	owner: User['_id'];

	//TODO: How to implement Set<> in one arrays like 1:n case in SQL
	@Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
	access: Array<User['_id']>;

	//TODO: How to implement Set<> in one arrays like 1:n case in SQL
	@Prop({ type: [{ type: Types.ObjectId, ref: List.name }] })
	lists: Array<List['_id']>;
}

export type BoardDocument = HydratedDocument<Board>;

export const BoardSchema = SchemaFactory.createForClass(Board);

const cascadeDelete = function (next) {
	this.model
		.findById(this._conditions)
		.exec()
		.then((board) => {
			if (!!board && !!board.lists?.length) {
				model(List.name, ListSchema)
					.deleteMany({ board: board._id })
					.exec()
					.then((res) => console.log('res', res))
					.catch((err) => console.log('err', err))
					.finally(() => next());
			}
			next();
		});
};

BoardSchema.pre<Board>(
	['findOneAndDelete', 'deleteMany', 'deleteOne'],
	{ document: false, query: true },
	cascadeDelete
);
