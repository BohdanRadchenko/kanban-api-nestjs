import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UseUser } from '../../decorators/user.decorator';
import { User } from '../../entities';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { BoardsService } from './boards.service';
import { BoardCreateRequestDto } from './dto/board-create.request.dto';

@Controller('boards')
export class BoardsController {
	constructor(private readonly service: BoardsService) {}

	@Post()
	@UseGuards(AccessJwtGuard)
	create(@Body() dto: BoardCreateRequestDto, @UseUser() user: User) {
		return this.service.create(user._id, dto);
	}

	@Get()
	@UseGuards(AccessJwtGuard)
	async getBoardsForUserById(@UseUser() user: User) {
		return this.service.getForUserById(user._id);
	}
}
