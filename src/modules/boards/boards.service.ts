import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, User } from '../../entities';
import { BoardCreateRequestDto } from './dto/board-create.request.dto';
import { BoardUpdateRequestDto } from './dto/board-update.request.dto';

@Injectable()
export class BoardsService {
	constructor(@InjectModel(Board.name) private readonly model: Model<Board>) {}

	private async isExistById(boardId: Board['_id']): Promise<boolean> {
		const data = await this.model.exists({ _id: boardId }).exec();
		return !!data;
	}

	private async validateBoardExist(boardId: Board['_id']) {
		const isExist = await this.isExistById(boardId);
		if (!isExist) {
			throw new NotFoundException(`Board with ID: ${boardId} not found!`);
		}
	}

	private async validateBoardAccess(boardId: Board['_id'], userId: User['_id']): Promise<boolean> {
		const data = await this.model
			.exists({
				$or: [
					{ _id: boardId, owner: userId },
					{ _id: boardId, access: { $in: [userId] } }
				]
			})
			.exec();

		if (!data) {
			throw new ForbiddenException();
		}

		return true;
	}

	private async validateBoardOwner(boardId: Board['_id'], userId: User['_id']): Promise<boolean> {
		const data = await this.model.exists({ _id: boardId, owner: userId }).exec();
		if (!data) {
			throw new ForbiddenException();
		}

		return true;
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
		await this.validateBoardExist(boardId);
		await this.validateBoardOwner(boardId, userId);
		const data = await this.model.findOneAndDelete({ _id: boardId, owner: userId }).exec();
		if (!data) {
			throw new ForbiddenException();
		}
		return data;
	}

	public async getById(boardId: Board['_id'], userId: User['_id']): Promise<Board> {
		await this.validateBoardExist(boardId);
		await this.validateBoardAccess(boardId, userId);

		return this.model
			.findOne({
				$or: [
					{ _id: boardId, owner: userId },
					{ _id: boardId, access: { $in: [userId] } }
				]
			})
			.exec();
	}

	public async updateBoardById(
		boardId: Board['_id'],
		userId: User['_id'],
		data: BoardUpdateRequestDto
	): Promise<Board> {
		await this.validateBoardExist(boardId);
		await this.validateBoardOwner(boardId, userId);

		return this.model.findOneAndUpdate(
			{ _id: boardId, owner: userId },
			{ ...data },
			{ new: true }
		).exec();
	}
}
