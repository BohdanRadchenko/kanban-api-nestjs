import { User } from '../../../entities';

export class AuthResponseDto {
	accessToken: string;
	refreshToken: string;
	userId: number;

	constructor(accessToken: string, refreshToken: string, user: User) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.userId = user.id;
	}
}
