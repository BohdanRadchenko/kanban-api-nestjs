import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, List, User } from '../../entities';
import { ListCreateRequestDto } from '../lists/dto/list-create.request.dto';
import { ListsService } from '../lists/lists.service';
import { BoardCreateRequestDto } from './dto/board-create.request.dto';
import { BoardUpdateRequestDto } from './dto/board-update.request.dto';

@Injectable()
export class BoardsService {
	constructor(
		@InjectModel(Board.name) private readonly model: Model<Board>,
		private readonly listsService: ListsService
	) {}

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

	public async getForUserById(userId: User['_id']) {
		return this.model
			.find({ $or: [{ access: { $in: [userId] } }, { owner: userId }] })
			.populate('owner')
			.exec();
	}

	public async deleteById(boardId: Board['_id'], userId: User['_id']) {
		await this.validateBoardExist(boardId);
		await this.validateBoardOwner(boardId, userId);
		const data = await this.model.findOneAndDelete({ _id: boardId, owner: userId }).exec();
		if (!data) {
			throw new ForbiddenException();
		}
		//TODO: how to create cascade delete action function
		await Promise.all(data.lists.map((listId) => this.listsService.remove(listId)));
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
			.populate('owner')
			.populate({
				path: 'lists',
				options: { sort: { pos: 1 } }
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

		return this.model.findOneAndUpdate({ _id: boardId, owner: userId }, { ...data }, { new: true }).exec();
	}

	public async createBoardList(boardId: Board['_id'], userId: User['_id'], body: ListCreateRequestDto): Promise<List> {
		await this.validateBoardExist(boardId);
		await this.validateBoardAccess(boardId, userId);

		const board = (await this.model.findById(boardId).exec()) as Board;

		const list = await this.listsService.create({ pos: board.lists.length, ...body, board: boardId });

		board.lists.push(list);

		await board.save();

		// await this.model
		// 	.findByIdAndUpdate(boardId, {
		// 		$push: {
		// 			lists: list._id
		// 		}
		// 	})
		// 	.exec();

		return list;
	}
}
