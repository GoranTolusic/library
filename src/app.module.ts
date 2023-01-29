import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './modules/users/users.module';
import { BooksModule } from './modules/books/books.module';
require('dotenv').config()

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    autoLoadEntities: true,
    synchronize: false,
  }), UsersModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
