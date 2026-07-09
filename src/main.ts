import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Set global prefix for API endpoints
  app.setGlobalPrefix('api');

  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that do not have decorators
      transform: true, // transform payloads to be objects typed according to DTO classes
      forbidNonWhitelisted: true, // throw error if non-whitelisted properties are provided
      transformOptions: {
        enableImplicitConversion: true, // automatically convert query params to numbers/booleans
      },
    }),
  );

  // Use global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('EN2H Booking Platform API')
    .setDescription('REST API for managing services and customer bookings')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api/docs`);
}
bootstrap();
