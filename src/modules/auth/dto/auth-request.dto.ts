import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthRequestDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(64)
	username!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(16)
	password!: string;
}
