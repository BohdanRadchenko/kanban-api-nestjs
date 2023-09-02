import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class BoardCreateRequestDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(16)
	title!: string;
}
