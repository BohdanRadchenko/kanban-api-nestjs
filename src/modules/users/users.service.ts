import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	public async isExistByUserName(username: string): Promise<boolean> {
		return await this.userRepository.exist({ where: { username } });
	}

	public async get(): Promise<User[]> {
		return this.userRepository.find();
	}

	public async getById(id: User['id']): Promise<User> {
		const user = await this.userRepository.findOneBy({ id });
		if (!user) {
			throw new NotFoundException(`User with ID: ${id} not found!`);
		}
		return user;
	}

	public async getByUsername(username: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ username });
		if (!user) {
			throw new NotFoundException(`User with username ${username} not found!`);
		}
		return user;
	}

	public async save(user: User): Promise<User> {
		return this.userRepository.save(user);
	}

	public async updateRefreshToken(userId: User['id'], refreshToken: string) {
		return this.userRepository
			.createQueryBuilder()
			.update(User)
			.set({
				refreshToken,
			})
			.where('id = :id', { id: userId })
			.execute();
	}
}
