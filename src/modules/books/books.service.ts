import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BorrowDto } from './dto/borrow.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Borrowed } from './entities/borrowed.entity';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private repository: Repository<Book>,
    @InjectRepository(Borrowed) private borrowRepository: Repository<Borrowed>
  ) { }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    let createdBook

    //Insert new book in DB
    try {
      createdBook = await this.repository.save(createBookDto)
    } catch (e) {
      throw new HttpException(e.message, 500)
    }

    return createdBook;
  }

  async findAll(params: { page: number; limit: number; }): Promise<Book[]> {
    let limit = params.limit || 10
    return await this.repository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: params.page ? (params.page - 1) * limit : 0,
      relations: ['user']
    })
  }

  async findOne(params: object): Promise<Book> {
    return await this.repository.findOne({
      where: params,
      relations: ['user']
    })
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    let updated
    let book = await this.findOne({ id: id })
    if (!book) throw new HttpException('Book not found!', 404)

    //create repo instance and save changes
    try {
      Object.assign(book, updateBookDto)
      updated = await this.repository.save(book)
    } catch (e) {
      throw new HttpException(e.message, 500)
    }

    return updated
  }

  async remove(id: number) {
    let book = await this.findOne({ id: id })
    if (!book) throw new HttpException('Book not found!', 404)
    await this.repository.delete(id)
    return { message: "deleted" };
  }

  async borrow(user, borrow: BorrowDto): Promise<Borrowed> {
    let checkIfBorrowedAlready = await this.borrowRepository.findOneBy({
      bookId: borrow.bookId
    })
    if (checkIfBorrowedAlready) throw new HttpException('Book is already borrowed!', 405)
    Object.assign(borrow, { userId: user.id })
    let created = await this.borrowRepository.create(borrow)
    return created
  }

  async unborrow(user, borrow: BorrowDto): Promise<string> {
    let checkIfBorrowedAlready = await this.borrowRepository.findOneBy({
      bookId: borrow.bookId,
      userId: user.id
    })
    if (!checkIfBorrowedAlready) throw new HttpException('Book is not on your borrowed list!', 404)
    await this.borrowRepository.delete(checkIfBorrowedAlready.id)
    return 'success'
  }
}
