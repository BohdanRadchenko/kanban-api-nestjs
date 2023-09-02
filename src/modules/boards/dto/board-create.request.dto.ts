import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { BOARD_TITLE_MAX_LENGTH, BOARD_TITLE_MIN_LENGTH } from '../../../constants/boards.constants';

export class BoardCreateRequestDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(BOARD_TITLE_MIN_LENGTH)
	@MaxLength(BOARD_TITLE_MAX_LENGTH)
	title!: string;
}
