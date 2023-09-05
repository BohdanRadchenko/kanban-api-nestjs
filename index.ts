import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import cors from 'cors';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { AppModule } from './src/app.module';

const corsOptions = {
	origin: process.env.CLIENT
};

const expressServer = express();

expressServer.use(cors(corsOptions));

const createFunction = async (expressInstance): Promise<void> => {
	const app = await NestFactory.create(
		AppModule,
		new ExpressAdapter(expressInstance),
	);
	await app.init();
};

export const api = functions.https.onRequest(async (request, response) => {
	await createFunction(expressServer);
	expressServer(request, response);
});
