import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { List, ListSchema } from '../../entities';
import { ListsService } from './lists.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: List.name,
				schema: ListSchema,
				collection: List.name
			}
		])
	],
	providers: [ListsService],
	exports: [ListsService]
})
export class ListsModule {
}
