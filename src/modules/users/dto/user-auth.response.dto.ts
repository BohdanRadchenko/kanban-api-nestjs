import { User } from '../../../entities';

export class UserAuthResponseDto {
	id: User['_id'];
	username: User['username'];
}
