import { User } from '../../../entities';
import { UserAuthResponseDto } from '../../users/dto/user-auth.response.dto';

export class AuthResponseDto {
	accessToken: string;
	refreshToken: string;
	user: UserAuthResponseDto;

	constructor(accessToken: string, refreshToken: string, user: User) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.user = this.dtoUser(user);
	}

	private dtoUser(user: User) {
		const { _id, username, ...rest } = user;
		return { username, id: _id } as UserAuthResponseDto;
	}
}
