import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { QuoteModule } from '../src/quote/quote.module';
import { CreateQuoteService } from '../src/quote/services/create-quote.service';
import { QuoteRepositoryInMemory } from './repositories/in-memory-quote-repository';
import { QuoteRepositoryToken } from '../src/quote/domain/repository/quote.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '../src/quote/entities/quote.entity';
import { createQuoteDto, mockCarrierInfo, mockToken } from './mocks';
import * as request from 'supertest';
import * as dotenv from 'dotenv';

dotenv.config();

describe('QuoteController (e2e)', () => {
  let app: INestApplication;
  let createQuoteService: CreateQuoteService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        QuoteModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: 'postgresql://admin:admin@localhost/cargo',
          entities: [Quote],
          autoLoadEntities: true,
        }),
      ],
      providers: [
        CreateQuoteService,
        {
          provide: QuoteRepositoryToken,
          useClass: QuoteRepositoryInMemory,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    createQuoteService =
      moduleFixture.get<CreateQuoteService>(CreateQuoteService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[POST] /quote', () => {
    it('should return offer simulations on carriers info', async () => {
      jest
        .spyOn(createQuoteService, 'execute')
        .mockResolvedValue(mockCarrierInfo);

      const response = await request(app.getHttpServer())
        .post('/quote')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(createQuoteDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(mockCarrierInfo);
    });

    it('should handle error when no offers are found', async () => {
      jest.spyOn(createQuoteService, 'execute').mockImplementationOnce(() => {
        throw new HttpException(
          'Não foram encontradas ofertas para a rota informada.',
          HttpStatus.NOT_FOUND,
        );
      });

      const response = await request(app.getHttpServer())
        .post('/quote')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(createQuoteDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Não foram encontradas ofertas para a rota informada.',
      });
    });

    it('should handle error when no authentication token is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/quote')
        .send(createQuoteDto)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Token de autenticação não fornecido.',
        error: 'Unauthorized',
      });
    });

    it('should handle error when authentication token is invalid', async () => {
      const invalidToken = 'invalid_token';

      const response = await request(app.getHttpServer())
        .post('/quote')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(createQuoteDto)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Token de autorização inválido',
        error: 'Unauthorized',
      });
    });
  });
});
