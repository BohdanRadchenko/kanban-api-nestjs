import { User } from '../../../entities';

export class AuthResponseDto {
	accessToken: string;
	refreshToken: string;
	user: User;

	constructor(accessToken: string, refreshToken: string, user: User) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.user = user;
	}
}
