import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { HashService } from '../../services/hash.service';
import { JWTService } from '../../services/jwt.service';
import { RedisService } from '../../services/redis.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), UsersModule],
  controllers: [BooksController],
  providers: [BooksService, HashService, JWTService, RedisService],
  exports: [BooksService]
})
export class BooksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
      .forRoutes(BooksController)
  }
}
