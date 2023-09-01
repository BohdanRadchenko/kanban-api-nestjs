import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { JWT_ACCESS_SECRET_EXPIRE, JWT_REFRESH_SECRET_EXPIRE } from '../../constants/auth.constants';
import { User } from '../../entities';
import { AlreadyExistException } from '../../exceptions';
import { IJwtPayload } from '../../interfaces/IJwtPayload';
import { UsersService } from '../users/users.service';
import { AuthRequestDto } from './dto/auth-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly config: ConfigService,
		private readonly jwt: JwtService
	) {}

	private async hashData(data: string) {
		return argon2.hash(data);
	}

	private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
		const payload: IJwtPayload = { username: user.username, id: user.id };
		const [accessToken, refreshToken] = await Promise.all([
			this.jwt.signAsync(payload, {
				secret: this.config.get('JWT_ACCESS_SECRET'),
				expiresIn: JWT_ACCESS_SECRET_EXPIRE
			}),
			this.jwt.signAsync(payload, {
				secret: this.config.get('JWT_REFRESH_SECRET'),
				expiresIn: JWT_REFRESH_SECRET_EXPIRE
			})
		]);

		return {
			accessToken,
			refreshToken
		};
	}

	private async updateRefreshToken(userId: User['id'], refreshToken: string) {
		const hashedRefreshToken = await this.hashData(refreshToken);
		await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
	}

	private async validateUserPassword(user: User, password): Promise<boolean> {
		const isCorrectPassword = user.compare(password);
		if (!isCorrectPassword) {
			throw new BadRequestException('Invalid password');
		}
		return isCorrectPassword;
	}

	private async login(user: User): Promise<AuthResponseDto> {
		const { accessToken, refreshToken } = await this.generateTokens(user);
		await this.updateRefreshToken(user.id, refreshToken);
		return new AuthResponseDto(accessToken, refreshToken, user);
	}

	public async signIn({ username, password }: AuthRequestDto): Promise<AuthResponseDto> {
		const user = await this.usersService.getByUsername(username);
		await this.validateUserPassword(user, password);
		return this.login(user);
	}

	public async signUp(dto: AuthRequestDto): Promise<AuthResponseDto> {
		const isExist = await this.usersService.isExistByUserName(dto.username);
		if (isExist) {
			throw new AlreadyExistException(`User with username: "${dto.username}" already exist!`);
		}
		const user = await this.usersService.save(User.of(dto));
		return this.login(user);
	}

	async logout(userId: User['id']) {
		return this.updateRefreshToken(userId, null);
	}
}
