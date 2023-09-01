import * as bcrypt from 'bcrypt';
import { Column, Entity } from 'typeorm';
import { SALT_OR_ROUNDS } from '../constants/auth.constants';
import { AuthRequestDto } from '../modules/auth/dto/auth-request.dto';
import { AbstractEntity } from './abstract.entity';

@Entity('user')
export class User extends AbstractEntity {
	@Column({ unique: true })
	username: string;

	@Column({ nullable: false, name: 'password' })
	passwordHash: string;

	@Column({ nullable: true })
	refreshToken: string;

	public async compare(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.passwordHash);
	}

	static of(dto: AuthRequestDto): User {
		const user = new User();
		user.username = dto.username;
		user.passwordHash = bcrypt.hashSync(dto.password, SALT_OR_ROUNDS);
		return user;
	}
}
