import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { RefreshJwtGuard } from '../../guards/refresh-jwt.guard';
import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/auth.request.dto';
import { AuthResponseDto } from './dto/auth.response.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	signIn(@Body() dto: AuthRequestDto): Promise<AuthResponseDto> {
		return this.authService.signIn(dto);
	}

	@Post('register')
	@HttpCode(HttpStatus.OK)
	signUp(@Body() dto: AuthRequestDto): Promise<AuthResponseDto> {
		return this.authService.signUp(dto);
	}

	@UseGuards(AccessJwtGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Get('logout')
	logout(@Req() req: Request) {
		return this.authService.logout(req.user['id']);
	}

	@UseGuards(RefreshJwtGuard)
	@Get('refresh')
	refreshTokens(@Req() req: Request): Promise<AuthResponseDto> {
		const userId = req.user['_id'];
		const refreshToken = req.user['refreshToken'];
		return this.authService.refreshTokens(userId, refreshToken);
	}
}
