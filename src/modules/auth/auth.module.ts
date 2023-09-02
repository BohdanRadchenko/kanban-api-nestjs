import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../../entities';
import { JwtAccessStrategy } from '../../strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from '../../strategies/jwt-refresh.strategy';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema, collection: User.name }]),
		JwtModule.register({ global: true }),
		PassportModule,
		UsersModule
	],
	controllers: [AuthController],
	providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, UsersService]
})
export class AuthModule {
}
