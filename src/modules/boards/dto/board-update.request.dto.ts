import { ArrayUnique, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import { BOARD_TITLE_MAX_LENGTH, BOARD_TITLE_MIN_LENGTH } from '../../../constants/boards.constants';

export class BoardUpdateRequestDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MinLength(BOARD_TITLE_MIN_LENGTH)
	@MaxLength(BOARD_TITLE_MAX_LENGTH)
	title!: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	owner!: Types.ObjectId;

	@IsOptional()
	@ArrayUnique()
	@IsNotEmpty()
	access!: Types.ObjectId[];
}
