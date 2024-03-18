import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
config()
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from 'db/data-source';
import { CurrentUserMiddleware } from './utility/middlewares/current-user.middleware';


@Module({
  imports: [
 TypeOrmModule.forRoot(dataSourceOptions),
 UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}


