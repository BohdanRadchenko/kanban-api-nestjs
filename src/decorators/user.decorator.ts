import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities';

export const UseUser = createParamDecorator((data: unknown, context: ExecutionContext): User => {
	return context.switchToHttp().getRequest().user || context.switchToWs().getClient().user;
});
