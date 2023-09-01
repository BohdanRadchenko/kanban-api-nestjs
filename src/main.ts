import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppValidationPipe } from './pipes/app-validation.pipe';

const PORT = parseInt(process.env.PORT) || 8080;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalPipes(new AppValidationPipe());

	await app.listen(PORT);
}

bootstrap();
