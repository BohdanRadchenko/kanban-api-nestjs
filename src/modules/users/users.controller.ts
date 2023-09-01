import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserId } from '../../decorators/user-id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	get(@UserId() userId: number) {
		console.log('userId', userId);
		return this.usersService.get();
	}
}
