import { Body, Controller, Get, Post, } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  async getAllBooks(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Post()
  async createBook(
    @Body()
  ): Promise<Book> {
    return this.bookService.create(Book);
  }
}
