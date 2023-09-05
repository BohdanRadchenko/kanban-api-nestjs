import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ListCreateRequestDto {
	@IsNotEmpty()
	@IsString()
	@IsNotEmpty()
	title!: string;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	pos!: string;
}
