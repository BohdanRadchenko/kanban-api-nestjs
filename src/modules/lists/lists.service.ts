import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, List } from '../../entities';
import { ListCreateRequestDto } from './dto/list-create.request.dto';
import { ListUpdateRequestDto } from './dto/list-update.request.dto';

@Injectable()
export class ListsService {
	constructor(@InjectModel(List.name) private readonly model: Model<List>) {}

	async create(dto: ListCreateRequestDto & { board: Board['_id'] }): Promise<List> {
		return this.model.create(dto);
	}

	async remove(listId: List['_id']): Promise<boolean> {
		const data = await this.model.findByIdAndDelete(listId).exec();
		console.log('data', data);
		return !!data;
	}

	public async updateListByEntity(data: ListUpdateRequestDto): Promise<List> {
		return this.model.findOneAndUpdate({ _id: data._id }, { ...data }, { new: true }).exec();
	}
}
