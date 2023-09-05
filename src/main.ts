import { NestFactory } from '@nestjs/core';
import { SocketAdapter } from './adapters/socket.adapter';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppValidationPipe } from './pipes/app-validation.pipe';

//TODO: create facade (filter?) service -> dto -> response

const PORT = parseInt(process.env.PORT) || 8080;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('/');
	app.enableCors({
		origin: '*',
		methods: ['POST', 'PUT', 'PATCH', 'DELETE', 'GET']
	});

	app.useWebSocketAdapter(new SocketAdapter(app));

	app.useGlobalFilters(new HttpExceptionFilter());

	app.useGlobalPipes(new AppValidationPipe());

	await app.listen(PORT);
}

bootstrap();
