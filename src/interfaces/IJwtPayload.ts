import { User } from '../entities';

export interface IJwtPayload extends Pick<User, '_id' | 'username'> {
}
