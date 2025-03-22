import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './helpers/interceptors/response.interceptor';

process.loadEnvFile();

async function bootstrap() {
  const configService = new ConfigService();

  const port = configService.get('PORT');

  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));
  app.enableCors();
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Micro Wallet API')
    .setDescription('Micro Wallet API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);

  const url = await app.getUrl();

  console.log(`Server is running on ${url}`);
}

bootstrap();
