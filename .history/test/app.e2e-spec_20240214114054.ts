import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Category } from '../src/book/schemas/book.schema';

describe('Book & Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    if (!process.env.DB_URI) {
      throw new Error('DB_URI environment variable is not set');
    }
    await mongoose.connect(process.env.DB_URI);
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const user = {
    name: 'Dapravith Rotha',
    email: 'dapravithrotha@gmail.com', // Make sure to use a valid email format
    password: '123456',
  };

  const newBook = {
    title: 'Book Version 222',
    description: 'Book 2 description',
    author: 'Author name 2',
    price: 200,
    category: Category.ADVENTURE,
  };

  let jwtToken: string = '';
  let bookCreated;

  describe('Auth', () => {
    it('(POST) - Register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201);

      expect(response.body.token).toBeDefined();
      jwtToken = response.body.token;
    });

    it('(POST) - Login user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login') // Make sure this matches your actual login endpoint
        .send({ email: user.email, password: user.password })
        .expect(200);

      expect(response.body.token).toBeDefined();
      jwtToken = response.body.token;
    });
  });

  describe('Book', () => {
    it('(POST) - Create new Book', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(newBook)
        .expect(201);

      expect(response.body._id).toBeDefined();
      expect(response.body.title).toEqual(newBook.title);
      bookCreated = response.body;
    });

    it('(GET) - Get all Books', async () => {
      await request(app.getHttpServer())
        .get('/books')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('(GET) - Get a Book by ID', async () => {
      await request(app.getHttpServer())
        .get(`/books/${bookCreated._id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(bookCreated._id);
        });
    });

    it('(PUT) - Update a Book by ID', async () => {
      const updatedBookTitle = 'Updated Book Title';
      await request(app.getHttpServer())
        .put(`/books/${bookCreated._id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: updatedBookTitle })
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toEqual(updatedBookTitle);
        });
    });

    it('(DELETE) - Delete a Book by ID', async () => {
      await request(app.getHttpServer())
        .delete(`/books/${bookCreated._id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });
});
