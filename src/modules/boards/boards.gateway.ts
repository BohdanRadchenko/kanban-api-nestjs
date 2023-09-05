import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import {
	EMIT_BOARD_UPDATED,
	EMIT_LIST_CREATED,
	EMIT_LIST_DELETED,
	EMIT_LIST_REORDERED,
	EMIT_LIST_UPDATED,
	EVENT_BOARD_UPDATE,
	EVENT_LIST_CREATE,
	EVENT_LIST_DELETE,
	EVENT_LIST_REORDER,
	EVENT_LIST_UPDATE
} from '../../constants/boards.endpoint';
import { UseUser } from '../../decorators/user.decorator';
import { Board, User } from '../../entities';
import { ISocketAuth } from '../../interfaces/ISocketAuth';
import { ListCreateRequestDto } from '../lists/dto/list-create.request.dto';
import { ListRemoveRequestDto } from '../lists/dto/list-remove.request.dto';
import { ListUpdateRequestDto } from '../lists/dto/list-update.request.dto';
import { ListsService } from '../lists/lists.service';
import { BoardsService } from './boards.service';
import { BoardUpdateRequestDto } from './dto/board-update.request.dto';
import { BoardResponseDto } from './dto/board.response.dto';

interface IClientData {
	id: string;
	userId: User['_id'];
	boardId: Board['_id'];
}

@Injectable()
@WebSocketGateway({ namespace: 'ws/board', cors: true })
export class BoardsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(BoardsGateway.name);

	constructor(
		private readonly boardsService: BoardsService,
		private readonly listsService: ListsService
	) {}

	@WebSocketServer()
	io: Namespace;

	private dto<T extends NonNullable<unknown>, D extends NonNullable<unknown>>(prevState: T | D, newState: T): T {
		return Object.entries(newState).reduce((acc, [k, v]) => {
			if (!prevState.hasOwnProperty(k)) return acc;
			acc[k] = v;
			return acc;
		}, {} as T) as T;
	}

	private getClientData(client: ISocketAuth): IClientData {
		return {
			id: client.id,
			userId: client.userId,
			boardId: client.boardId
		};
	}

	private validateClient(client: ISocketAuth): IClientData {
		const data = this.getClientData(client);
		const { userId, boardId } = data;
		if (!userId || !boardId) {
			throw new BadRequestException('Invalid emit data!');
		}
		return data;
	}

	private log(type: string, ev: string, data, { id, boardId }) {
		const str = `${type}: ${ev}: BOARD ID: ${boardId}: data: `;
		this.logger.log(str, data);
	}

	private logEvent(ev: string, data, { id, boardId }) {
		this.log('EVENT', ev, data, { id, boardId });
	}

	private logEmit(ev: string, data, { id, boardId }) {
		this.log('EMIT', ev, data, { id, boardId });
	}

	private emit(ev: string, data, { id, boardId }) {
		this.logEmit(ev, data, { id, boardId });
		this.io.to(boardId.toString()).except(id).emit(ev, data);
	}

	private updatedBoard(data, credential) {
		this.emit(EMIT_BOARD_UPDATED, data, credential);
	}

	private createdList(data, credential) {
		this.emit(EMIT_LIST_CREATED, data, credential);
	}

	private deletedList(data, credential) {
		this.emit(EMIT_LIST_DELETED, data, credential);
	}

	private updatedList(data, credential) {
		this.emit(EMIT_LIST_UPDATED, data, credential);
	}

	private reorderedList(data, credential) {
		this.emit(EMIT_LIST_REORDERED, data, credential);
	}

	public disconnectAllFrom(boardId: Board['_id']) {
		this.emit('disconnected', null, { id: null, boardId });
		this.io.in(boardId.toString()).disconnectSockets(true);
	}

	public handleConnection(client: ISocketAuth, ...args: any[]) {
		try {
			this.validateClient(client);
			client.join(client.boardId?.toString());
			this.io.in(client.boardId?.toString()).emit('connected', {
				client: client.id,
				userId: client.userId,
				boardId: client.boardId
			});
		} catch (ex) {
			this.logger.error(ex);
			return new BadRequestException(ex);
		}
	}

	public handleDisconnect(client: ISocketAuth) {
		client.leave(client.boardId?.toString());
		this.io.in(client.boardId?.toString()).emit('disconnected', { client: client.id, userId: client.userId });
	}

	@SubscribeMessage(EVENT_BOARD_UPDATE)
	async handleUpdateBoardProperties(
		@MessageBody() body: BoardUpdateRequestDto,
		@ConnectedSocket() client: ISocketAuth,
		@UseUser() user: User
	) {
		this.logEvent(EVENT_BOARD_UPDATE, body, this.getClientData(client));
		const { id, userId, boardId } = this.validateClient(client);
		const data = await this.boardsService.updateBoardById(boardId, userId, body);
		const board = BoardResponseDto.of(data, user);
		this.updatedBoard(this.dto(body, board), { id, boardId });
	}

	@SubscribeMessage(EVENT_LIST_CREATE)
	async handleCreateBoardList(
		@MessageBody() body: ListCreateRequestDto,
		@ConnectedSocket() client: ISocketAuth,
		@UseUser() user: User
	) {
		this.logEvent(EVENT_LIST_CREATE, body, this.getClientData(client));
		const { userId, boardId } = this.validateClient(client);
		const list = await this.boardsService.createBoardList(boardId, userId, body);
		this.createdList(list, { userId, boardId });
	}

	@SubscribeMessage(EVENT_LIST_DELETE)
	async handleRemoveBoardList(
		@MessageBody() body: ListRemoveRequestDto,
		@ConnectedSocket() client: ISocketAuth,
		@UseUser() user: User
	) {
		this.logEvent(EVENT_LIST_DELETE, body, this.getClientData(client));
		const { userId, boardId } = this.validateClient(client);
		const isDeleted = await this.listsService.remove(body.listId);
		if (!isDeleted) return;
		this.deletedList(body, { userId, boardId });
	}

	@SubscribeMessage(EVENT_LIST_UPDATE)
	async handleUpdateBoardList(
		@MessageBody() body: ListUpdateRequestDto,
		@ConnectedSocket() client: ISocketAuth,
		@UseUser() user: User
	) {
		this.logEvent(EVENT_LIST_UPDATE, body, this.getClientData(client));
		const { userId, boardId } = this.validateClient(client);
		await this.listsService.updateListByEntity(body);
		this.updatedList(body, { userId, boardId });
	}

	@SubscribeMessage(EVENT_LIST_REORDER)
	async handleReorderBoardLists(
		@MessageBody() body: { lists: ListUpdateRequestDto[] },
		@ConnectedSocket() client: ISocketAuth,
		@UseUser() user: User
	) {
		this.logEvent(EVENT_LIST_REORDER, body, this.getClientData(client));
		const { userId, boardId } = this.validateClient(client);

		const data = await Promise.all(body.lists.map((el) => this.listsService.updateListByEntity(el)));
		const dtoData = data.map(({ cards, ...rest }) => rest);
		this.reorderedList(dtoData, { userId, boardId });
	}
}
