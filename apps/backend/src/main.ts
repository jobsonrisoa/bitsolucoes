import { loadRootEnv } from './config/load-env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './shared/presentation/global-exception.filter';

async function bootstrap() {
  loadRootEnv();

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(Logger)));
  
  const config = new DocumentBuilder()
    .setTitle('Atrio API')
    .setDescription('Internal requests portal')
    .setVersion('1.0')
    .addCookieAuth('session')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  app.enableShutdownHooks();
  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();
