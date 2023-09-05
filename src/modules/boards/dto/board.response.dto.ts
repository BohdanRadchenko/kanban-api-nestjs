import { Board, User } from '../../../entities';

export class BoardResponseDto {
	private readonly _id: Board['_id'];
	private readonly title: Board['title'];
	private readonly access: Board['access'];
	private readonly owner: Board['owner'];
	private readonly isOwner: boolean;
	private readonly lists: Board['lists'];

	private constructor(board: Board, user: User) {
		this._id = board._id;
		this.title = board.title;
		this.access = board.access;
		this.owner = board.owner;
		this.isOwner = board.owner == user._id;
		this.lists = board.lists;
	}

	public static of(board: Board, user: User): BoardResponseDto {
		return new BoardResponseDto(board, user);
	}
}
