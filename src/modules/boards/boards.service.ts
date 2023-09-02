import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, User } from '../../entities';
import { BoardCreateRequestDto } from './dto/board-create.request.dto';

@Injectable()
export class BoardsService {
	constructor(@InjectModel(Board.name) private readonly model: Model<Board>) {}

	public async create(userId: User['_id'], dto: BoardCreateRequestDto): Promise<Board> {
		return this.model.create({
			...dto,
			owner: userId
		});
	}

	public async getForUserById(userId: User['_id']): Promise<Board[]> {
		return this.model.find({ $or: [{ access: { $in: [userId] } }, { owner: userId }] }).exec();
	}
}
