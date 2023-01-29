import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ApiHeader, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddBook } from '../../guards/addBook.guard';
import { OwnerShip } from '../../guards/ownerShip.guard';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { UserGuard } from '../../guards/user.guard';

@ApiTags('books')
@ApiHeader({ name: 'accesstoken', description: 'token' })
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('create')
  @UseGuards(UserGuard)
  @UseGuards(AddBook)
  @ApiResponse({ type: Book, status: 200 })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.booksService.create(createBookDto);
  }

  @ApiResponse({ type: Book, status: 200, isArray: true })
  @ApiQuery({ name: 'page', description: 'number of page', required: false })
  @ApiQuery({ name: 'limit', description: 'number of users', required: false })
  @Get()
  async findAll(@Query() params) {
    return await this.booksService.findAll(params);
  }

  @ApiResponse({ type: Book, status: 200 })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.booksService.findOne({ id: id });
  }

  @ApiResponse({ type: Book, status: 200 })
  @Patch(':id')
  @UseGuards(UserGuard)
  @UseGuards(OwnerShip)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @ApiResponse({ type: Book, status: 200 })
  @Delete(':id')
  @UseGuards(UserGuard)
  @UseGuards(OwnerShip)
  remove(@Param('id') id: number) {
    return this.booksService.remove(id);
  }
}
