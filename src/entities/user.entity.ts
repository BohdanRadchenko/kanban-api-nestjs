import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';
import { SALT_OR_ROUNDS } from '../constants/auth.constants';
import { AuthRequestDto } from '../modules/auth/dto/auth-request.dto';
import { AbstractEntity } from './abstract.entity';

@Schema()
export class User extends AbstractEntity {
	@Prop({ unique: true })
	username: string;

	@Prop({ name: 'password' })
	passwordHash: string;

	@Prop()
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

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
