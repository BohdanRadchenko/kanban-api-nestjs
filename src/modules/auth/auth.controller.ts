import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/auth-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	signIn(@Body() dto: AuthRequestDto): Promise<AuthResponseDto> {
		return this.authService.signIn(dto);
	}

	@Post('register')
	signUp(@Body() dto: AuthRequestDto) {
		return this.authService.signUp(dto);
	}

	@Get('logout')
	logout(@Req() req: Request) {
		return this.authService.logout(req.user['id']);
	}
}
