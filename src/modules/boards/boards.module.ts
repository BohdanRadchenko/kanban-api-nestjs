import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from '../../entities';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema, collection: Board.name }])],
	controllers: [BoardsController],
	providers: [BoardsService]
})
export class BoardsModule {
}
