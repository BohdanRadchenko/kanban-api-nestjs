import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserId } from '../../decorators/user-id.decorator';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@UseGuards(AccessJwtGuard)
	get(@UserId() userId: number) {
		console.log('userId', userId);
		return this.usersService.get();
	}
}
