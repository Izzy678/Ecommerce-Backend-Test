import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvConfigEnum } from './common/enum/envConfig.enum';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
    .setDescription('Ecommerce API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  const config = app.get(ConfigService);
  const port = config.get<number>(EnvConfigEnum.PORT) || 3000;
  await app.listen(port);
}
bootstrap();
