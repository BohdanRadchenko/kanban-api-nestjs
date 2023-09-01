import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
	imports: [TypeOrmModule.forFeature([User]), JwtModule.register({ global: true }), PassportModule, UsersModule],
	controllers: [AuthController],
	providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, UsersService]
})
export class AuthModule {
}
