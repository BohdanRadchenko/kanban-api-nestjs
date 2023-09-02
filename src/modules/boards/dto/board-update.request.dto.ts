import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { BOARD_TITLE_MAX_LENGTH, BOARD_TITLE_MIN_LENGTH } from '../../../constants/boards.constants';

export class BoardUpdateRequestDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MinLength(BOARD_TITLE_MIN_LENGTH)
	@MaxLength(BOARD_TITLE_MAX_LENGTH)
	title: string;

	//TODO: change owner to another mapping
	// @IsOptional()
	// @IsString()
	// @IsNotEmpty()
	// owner!: Types.ObjectId;

	//TODO: add/remove access to another mapping
	// @IsOptional()
	// @ArrayUnique()
	// @IsNotEmpty()
	// access!: Types.ObjectId[];
}
