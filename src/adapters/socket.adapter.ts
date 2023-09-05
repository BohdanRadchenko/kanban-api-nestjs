import { ForbiddenException, INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { IEnvironmentVariables } from '../interfaces/IEnvironmentVariables';

const createTokenMiddleware = (verify) => (socket, next) => {
	const token = socket.handshake.auth.token || socket.handshake.headers['token'];
	const boardId =
		socket.handshake.auth.boardId || socket.handshake.headers['boardId'] || socket.handshake.query.boardId;

	try {
		const payload = verify(token);
		socket.userId = payload._id;
		socket.boardId = boardId;
		socket.user = payload;
		next();
	} catch (ex) {
		next(new ForbiddenException(ex));
	}
};

export class SocketAdapter extends IoAdapter {
	private readonly configService: ConfigService<IEnvironmentVariables>;

	constructor(private readonly app: INestApplicationContext) {
		super(app);
		this.configService = app.get(ConfigService);
	}

	public createIOServer(port: number, options?: any): any {
		const server: Server = super.createIOServer(port, options);
		const jwtService = this.app.get(JwtService);

		const verify = (token: string) => {
			return jwtService.verify(token, { secret: this.configService.get('JWT_ACCESS_SECRET') });
		};

		server.of('ws/board').use(createTokenMiddleware(verify));

		return server;
	}
}
