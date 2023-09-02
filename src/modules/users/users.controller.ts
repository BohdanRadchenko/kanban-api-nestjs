import { Controller, Get, UseGuards } from '@nestjs/common';
import { UseUser } from '../../decorators/user.decorator';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@UseGuards(AccessJwtGuard)
	get(@UseUser() userId: number) {
		console.log('userId', userId);
		return this.usersService.get();
	}
}
