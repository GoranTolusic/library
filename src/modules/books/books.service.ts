import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private repository: Repository<Book>
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
}
