import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { MinioService } from './modules/minio/minio.service';
import { cardsBucketName } from './modules/card/card.service';

const swaggerBucket = 'swagger-bucket';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const minioService = app.get(MinioService);
  await Promise.all([minioService.createBucketIfNotExists(swaggerBucket, true), minioService.createBucketIfNotExists(cardsBucketName, true)])

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  const swaggerCfg = new DocumentBuilder()
    .setTitle('Flash Cards API')
    .setDescription('API documentation for the Flash Cards application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'accessToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup('api', app, document);

  const buffer = Buffer.from(JSON.stringify(document, null, 2), 'utf-8');

  await minioService.uploadSwaggerJson(
    swaggerBucket,
    'swagger/swagger.json',
    buffer,
  );

  writeFileSync('swagger.json', buffer);

  await app.listen(process.env.PORT ?? 42069);
}

bootstrap();
