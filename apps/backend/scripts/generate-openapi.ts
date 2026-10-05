import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = new DocumentBuilder()
    .setTitle('Atrio API')
    .setDescription('Internal requests portal')
    .setVersion('1.0')
    .addCookieAuth('session')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  const yamlString = yaml.dump(document);
  fs.writeFileSync('../docs/api/openapi.yaml', yamlString);
  await app.close();
}
bootstrap();
