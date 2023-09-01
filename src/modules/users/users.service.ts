import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../entities';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>
	) {}

	public async isExistByUserName(username: string): Promise<boolean> {
		const result = await this.userModel.exists({ username }).exec();
		return !!result;
	}

	public async get(): Promise<User[]> {
		return this.userModel.find().exec();
	}

	public async getById(id: User['_id']): Promise<User> {
		const user = await this.userModel.findOne({ id }).exec();
		if (!user) {
			throw new NotFoundException(`User with ID: ${id} not found!`);
		}
		return user;
	}

	public async getByUsername(username: string): Promise<User> {
		const user = await this.userModel.findOne({ username }).exec();
		if (!user) {
			throw new NotFoundException(`User with username ${username} not found!`);
		}
		return user;
	}

	public async save(user: User): Promise<User> {
		return this.userModel.create(user);
	}

	public async updateRefreshToken(userId: User['_id'], refreshToken: string) {
		return this.userModel.findOneAndUpdate({ _id: userId }, { refreshToken }).exec();
	}
}
