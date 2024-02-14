/* eslint-disable @typescript-eslint/no-unused-vars */
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';

describe('BookService', () => {
  let bookService: BookService;
  let model: Model<Book>;

  const mockBookService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: BookService,
        },
      ],
    }).compile();

    bookService = module.get < BookService >{ BookService }
    model = module.get<Model>(getModelToken(Book.name));
  });
});
