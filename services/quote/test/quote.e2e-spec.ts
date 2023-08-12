import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { QuoteModule } from '../src/quote/quote.module';
import { CreateQuoteService } from '../src/quote/services/create-quote.service';
import { QuoteRepositoryInMemory } from './repositories/in-memory-quote-repository';
import { QuoteRepositoryToken } from '../src/quote/domain/repository/quote.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '../src/quote/entities/quote.entity';
import { CreateQuoteDto } from '../src/quote/dto/create-quote.dto';
import { CarrierInfo } from '../src/quote/interfaces/carrier.interface';
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
      const createQuoteDto: CreateQuoteDto = {
        recipient: {
          address: {
            zipcode: '01311000',
          },
        },
        volumes: [
          {
            category: 7,
            amount: 1,
            unitary_weight: 5,
            price: 349,
            sku: 'abc-teste-123',
            height: 0.2,
            width: 0.2,
            length: 0.2,
          },
          {
            category: 7,
            amount: 2,
            unitary_weight: 4,
            price: 556,
            sku: 'abc-teste-527',
            height: 0.4,
            width: 0.6,
            length: 0.15,
          },
        ],
      };

      const mockCarrierInfo: CarrierInfo[] = [
        {
          name: 'UBER',
          service: 'Normal',
          deadline: '4',
          price: 58.95,
        },
        {
          name: 'CORREIOS',
          service: 'Normal',
          deadline: '5',
          price: 78.03,
        },
        {
          name: 'CORREIOS',
          service: 'PAC',
          deadline: '5',
          price: 92.45,
        },
        {
          name: 'BTU BRASPRESS',
          service: 'Normal',
          deadline: '5',
          price: 93.35,
        },
        {
          name: 'CORREIOS',
          service: 'SEDEX',
          deadline: '1',
          price: 162.68,
        },
      ];

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbnBqIjoiMjU0MzgyOTYwMDAxNTgifQ.maLLvC5ily7BSrnmsPN3kX6aUmWPd4nTGFTNS8K2jVE';

      jest
        .spyOn(createQuoteService, 'execute')
        .mockResolvedValue(mockCarrierInfo);

      const response = await request(app.getHttpServer())
        .post('/quote')
        .set('Authorization', `Bearer ${token}`)
        .send(createQuoteDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(mockCarrierInfo);
    });

    it('should handle error when no offers are found', async () => {
      const createQuoteDto: CreateQuoteDto = {
        recipient: {
          address: {
            zipcode: '01311000',
          },
        },
        volumes: [
          {
            category: 7,
            amount: 1,
            unitary_weight: 5,
            price: 349,
            sku: 'abc-teste-123',
            height: 0.2,
            width: 0.2,
            length: 0.2,
          },
          {
            category: 7,
            amount: 2,
            unitary_weight: 4,
            price: 556,
            sku: 'abc-teste-527',
            height: 0.4,
            width: 0.6,
            length: 0.15,
          },
        ],
      };

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbnBqIjoiMjU0MzgyOTYwMDAxNTgifQ.maLLvC5ily7BSrnmsPN3kX6aUmWPd4nTGFTNS8K2jVE';

      jest.spyOn(createQuoteService, 'execute').mockImplementationOnce(() => {
        throw new HttpException(
          'Não foram encontradas ofertas para a rota informada.',
          HttpStatus.NOT_FOUND,
        );
      });

      const response = await request(app.getHttpServer())
        .post('/quote')
        .set('Authorization', `Bearer ${token}`)
        .send(createQuoteDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Não foram encontradas ofertas para a rota informada.',
      });
    });

    it('should handle error when no authentication token is provided', async () => {
      const createQuoteDto: CreateQuoteDto = {
        recipient: {
          address: {
            zipcode: '01311000',
          },
        },
        volumes: [
          {
            category: 7,
            amount: 1,
            unitary_weight: 5,
            price: 349,
            sku: 'abc-teste-123',
            height: 0.2,
            width: 0.2,
            length: 0.2,
          },
          {
            category: 7,
            amount: 2,
            unitary_weight: 4,
            price: 556,
            sku: 'abc-teste-527',
            height: 0.4,
            width: 0.6,
            length: 0.15,
          },
        ],
      };

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
      const createQuoteDto: CreateQuoteDto = {
        recipient: {
          address: {
            zipcode: '01311000',
          },
        },
        volumes: [
          {
            category: 7,
            amount: 1,
            unitary_weight: 5,
            price: 349,
            sku: 'abc-teste-123',
            height: 0.2,
            width: 0.2,
            length: 0.2,
          },
          {
            category: 7,
            amount: 2,
            unitary_weight: 4,
            price: 556,
            sku: 'abc-teste-527',
            height: 0.4,
            width: 0.6,
            length: 0.15,
          },
        ],
      };

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
