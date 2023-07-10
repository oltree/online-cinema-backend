import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigService } from '@nestjs/config';
import { getMongodbConfig } from './config/mongo.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GenreModule } from './genre/genre.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongodbConfig,
    }),
    AuthModule,
    UserModule,
    GenreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
