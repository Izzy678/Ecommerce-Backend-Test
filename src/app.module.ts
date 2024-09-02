import {
  Logger,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfigEnum } from './common/enum/envConfig.enum';
import { envConfigValidator } from './common/validator/env.validator';
import { UserModule } from './user/UserModule';
import { TokenModule } from './token/TokenModule';
import { TokenMiddleware } from './common/middleware/TokenMiddleware';
import { ProductModule } from './product/ProductModule';

@Module({
  imports: [
    ProductModule,
    UserModule,
    TokenModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>(
          EnvConfigEnum.CONNECTION_STRING,
        );
        Logger.debug(`CONNECTION STRING ${connectionString}`);
        return {
          uri: connectionString,
          autoIndex: true,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envConfigValidator,
    }),
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer
      .apply(TokenMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
