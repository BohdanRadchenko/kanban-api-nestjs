import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema, List, ListSchema, User, UserSchema } from '../../entities';
import { ListsService } from '../lists/lists.service';
import { BoardsController } from './boards.controller';
import { BoardsGateway } from './boards.gateway';
import { BoardsService } from './boards.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Board.name,
				schema: BoardSchema,
				collection: Board.name
			},
			{
				name: User.name,
				schema: UserSchema,
				collection: User.name
			},
			{
				name: List.name,
				schema: ListSchema,
				collection: List.name
			}
		])
	],
	controllers: [BoardsController],
	providers: [BoardsService, BoardsGateway, ListsService]
})
export class BoardsModule {
}
