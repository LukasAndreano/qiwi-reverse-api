import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResInterceptor } from './interceptors/res.interceptor';
import { ParamsMiddleware } from './middleware/params/params.middleware';
import { StartParamsModule } from './middleware/params/params.module';
import { AuthModule } from './controllers/auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestModule } from './controllers/request/request.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      extra: {
        connectionLimit: +process.env.DB_CONNECTION_LIMIT || 10,
      },
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      charset: process.env.DB_CHARSET || 'utf8mb4_general_ci',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/entities/*.entity.{js,ts}'],
      synchronize: process.env.DB_SYNC === 'true',
      cache: false,
    }),
    StartParamsModule,
    AuthModule,
    TasksModule,
    RequestModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParamsMiddleware).exclude('auth/(.*)?').forRoutes('*');
  }
}
