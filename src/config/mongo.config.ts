import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { IEnvironmentVariables } from '../interfaces/IEnvironmentVariables';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
	constructor(private readonly config: ConfigService<IEnvironmentVariables>) {
	}

	public createMongooseOptions(): MongooseModuleOptions {
		return {
			uri: this.config.get('MONGO_CONNECT')
		} as MongooseModuleOptions;
	}
}
