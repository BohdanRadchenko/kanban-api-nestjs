import { Socket } from 'socket.io';
import { Board, User } from '../entities';

export interface ISocketAuth extends Socket {
	userId: User['_id'];
	boardId: Board['_id'];
}
