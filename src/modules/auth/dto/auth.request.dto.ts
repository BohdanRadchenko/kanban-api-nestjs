import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import {
	AUTH_PASSWORD_MAX_LENGTH,
	AUTH_PASSWORD_MIN_LENGTH,
	AUTH_USERNAME_MAX_LENGTH,
	AUTH_USERNAME_MIN_LENGTH
} from '../../../constants/auth.constants';

export class AuthRequestDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(AUTH_USERNAME_MIN_LENGTH)
	@MaxLength(AUTH_USERNAME_MAX_LENGTH)
	username!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(AUTH_PASSWORD_MIN_LENGTH)
	@MaxLength(AUTH_PASSWORD_MAX_LENGTH)
	password!: string;
}
