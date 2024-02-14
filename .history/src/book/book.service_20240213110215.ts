import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(query: any): Promise<Book[]> { // Changed Query type to any
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const books = await this.bookModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return books;
  }

  async create(bookData: Book): Promise<Book> {
    const createdBook = new this.bookModel(bookData);
    return createdBook.save();
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found.');
    }
    return book;
  }

  async updateById(id: string, bookData: any): Promise<Book> {
    const updatedBook = await this.bookModel.findByIdAndUpdate(id, bookData, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) {
      throw new NotFoundException('Book not found.');
    }
    return updatedBook;
  }

  async deleteById(id: string): Promise<Book> {
    const deletedBook = await this.bookModel.findByIdAndDelete(id);
    if (!deletedBook) {
      throw new NotFoundException('Book not found.');
    }
    return deletedBook;
  }
}
