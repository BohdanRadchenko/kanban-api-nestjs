import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, User } from '../../entities';
import { BoardCreateRequestDto } from './dto/board-create.request.dto';

@Injectable()
export class BoardsService {
	constructor(@InjectModel(Board.name) private readonly model: Model<Board>) {}

	private async isExistById(boardId: Board['_id']): Promise<boolean> {
		const data = await this.model.exists({ _id: boardId }).exec();
		return !!data;
	}

	public async create(userId: User['_id'], dto: BoardCreateRequestDto): Promise<Board> {
		return this.model.create({
			...dto,
			owner: userId
		});
	}

	public async getForUserById(userId: User['_id']): Promise<Board[]> {
		return this.model.find({ $or: [{ access: { $in: [userId] } }, { owner: userId }] });
	}

	public async deleteBoardById(boardId: Board['_id'], userId: User['_id']) {
		const isExist = await this.isExistById(boardId);
		if (!isExist) {
			throw new NotFoundException(`Board with ID: ${boardId} not found!`);
		}

		const data = await this.model.findOneAndDelete({ _id: boardId, owner: userId }).exec();
		if (!data) {
			throw new ForbiddenException();
		}
		return data;
	}
}
