import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UseUser } from '../../decorators/user.decorator';
import { User } from '../../entities';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { BoardsService } from './boards.service';
import { BoardCreateRequestDto } from './dto/board-create.request.dto';
import { BoardResponseDto } from './dto/board.response.dto';

@Controller('boards')
export class BoardsController {
	constructor(private readonly service: BoardsService) {}

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
}
