import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../entities';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema, collection: User.name }])],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService]
})
export class UsersModule {
}
