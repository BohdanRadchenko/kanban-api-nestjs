import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IEnvironmentVariables } from '../../../interfaces/IEnvironmentVariables';
import { IJwtPayload } from '../../../interfaces/IJwtPayload';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly config: ConfigService<IEnvironmentVariables>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get('JWT_ACCESS_SECRET')
		});
	}

	public validate(payload: IJwtPayload) {
		return payload;
	}
}
