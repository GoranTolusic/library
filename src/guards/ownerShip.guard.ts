import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { BooksService } from '../modules/books/books.service';

@Injectable()
export class OwnerShip implements CanActivate {
  private booksService
  constructor(booksService: BooksService) {
    this.booksService = booksService
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let proceed = false
    if (!request.params.id) throw new HttpException('param id is missing', 400)
    let bookWithOwner = await this.booksService.findOne({ id: parseInt(request.params.id) })
    if (!bookWithOwner) throw new HttpException('Book not found', 404)

    //If you are owner then proceed
    if (bookWithOwner.userId == request.user.id) proceed = true

    //If you are admin and owner of book is author then proceed
    if (request.user.role == 'admin' && bookWithOwner.user.role == 'author') proceed = true

    return proceed;
  }
}