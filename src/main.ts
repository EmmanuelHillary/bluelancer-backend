import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: /.+/ });

  const appEnv = process.env.APP_ENV;

  if (appEnv !== 'local') app.setGlobalPrefix('bluelancer');

  if (appEnv == 'development' || appEnv == 'local') {
    const config = new DocumentBuilder()
      .setTitle('BlueLancer API')
      .setDescription('BlueLancer API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    if (appEnv == 'development') {
      SwaggerModule.setup('bluelancer/dev/documentation', app, document, {
        customJs: [
          'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
        ],
        customCssUrl: [
          'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
        ],
      });
    } else {
      SwaggerModule.setup('/dev/documentation', app, document);
    }
  }

  await app.listen(3000);
}
bootstrap();
