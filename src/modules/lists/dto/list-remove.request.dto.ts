import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ListRemoveRequestDto {
	@IsNotEmpty()
	@IsString()
	listId!: Types.ObjectId;
}
