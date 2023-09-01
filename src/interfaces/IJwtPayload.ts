import { User } from '../entities';

export interface IJwtPayload extends Pick<User, 'id' | 'username'> {
}
