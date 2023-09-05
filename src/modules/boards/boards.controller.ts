import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UseUser } from '../../decorators/user.decorator';
import { Board, User } from '../../entities';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { ParseObjectIdPipe } from '../../pipes/parse-object-id.pipe';
import { BoardsGateway } from './boards.gateway';
import { BoardsService } from './boards.service';
import { BoardCreateRequestDto } from './dto/board-create.request.dto';
import { BoardUpdateRequestDto } from './dto/board-update.request.dto';
import { BoardResponseDto } from './dto/board.response.dto';

@Controller('boards')
export class BoardsController {
	constructor(
		private readonly service: BoardsService,
		private readonly boardsGateway: BoardsGateway
	) {}

	@Post()
	@UseGuards(AccessJwtGuard)
	async create(@Body() dto: BoardCreateRequestDto, @UseUser() user: User) {
		const board = await this.service.create(user._id, dto);
		return BoardResponseDto.of(board, user);
	}

	@Get()
	@UseGuards(AccessJwtGuard)
	async getBoardsForUserById(@UseUser() user: User) {
		const data = await this.service.getForUserById(user._id);
		return data.map((board) => BoardResponseDto.of(board, user));
	}

	@Delete(':boardId')
	@UseGuards(AccessJwtGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('boardId', ParseObjectIdPipe) boardId: Board['_id'], @UseUser() user: User) {
		await this.service.deleteById(boardId, user._id);
		this.boardsGateway.disconnectAllFrom(boardId);
		return;
	}

	@Get(':boardId')
	@UseGuards(AccessJwtGuard)
	async getBoardById(@Param('boardId', ParseObjectIdPipe) boardId: Board['_id'], @UseUser() user: User) {
		const board = await this.service.getById(boardId, user._id);
		return BoardResponseDto.of(board, user);
	}

	@Patch(':boardId')
	@UseGuards(AccessJwtGuard)
	async updateBoardById(
		@Param('boardId', ParseObjectIdPipe) boardId: Board['_id'],
		@UseUser() user: User,
		@Body() data: BoardUpdateRequestDto
	) {
		const board = await this.service.updateBoardById(boardId, user._id, data);
		return BoardResponseDto.of(board, user);
	}
}
