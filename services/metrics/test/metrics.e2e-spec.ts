import {
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '../src/common/entities/quote.entity';
import { MetricsModule } from '../src/metrics/metrics.module';
import { ListMetricsService } from '../src/metrics/services/list-metrics.service';
import { MetricsRepositoryInMemory } from './repositories/in-memory-metrics-repository';
import { MetricsRepositoryToken } from '../src/metrics/domain/repository/metrics.repository';
import { MetricsParam } from '../src/metrics/dto/metrics.param';
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import { IMetricsSummary } from '../src/metrics/domain/interfaces/metrics.interface';

dotenv.config();

const mockSummary: IMetricsSummary = {
  carriers: [
    {
      carrier: 'UBER',
      total_quotes: 1,
      total_price: 58.95,
      average_price: 58.95,
      cheapest_price: 58.95,
      highest_price: 58.95,
    },
    {
      carrier: 'CORREIOS',
      total_quotes: 3,
      total_price: 333.16,
      average_price: 111.05333333333334,
      cheapest_price: 78.03,
      highest_price: 162.68,
    },
    {
      carrier: 'BTU BRASPRESS',
      total_quotes: 1,
      total_price: 93.35,
      average_price: 93.35,
      cheapest_price: 93.35,
      highest_price: 93.35,
    },
  ],
  global_metrics: {
    average_price: 97.092,
    total_quotes: 5,
    total_price: 485.46,
    cheapest_price: 58.95,
    highest_price: 162.68,
  },
};

describe('MetricsController (e2e)', () => {
  let app: INestApplication;
  let listMetricsService: ListMetricsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MetricsModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: 'postgresql://admin:admin@localhost/cargo',
          entities: [Quote],
          autoLoadEntities: true,
        }),
      ],
      providers: [
        ListMetricsService,
        {
          provide: MetricsRepositoryToken,
          useClass: MetricsRepositoryInMemory,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    listMetricsService =
      moduleFixture.get<ListMetricsService>(ListMetricsService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[GET] /metrics', () => {
    it('should return metrics summary', async () => {
      const metricsParam: MetricsParam = {
        last_quotes: '5',
      };

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbnBqIjoiMjU0MzgyOTYwMDAxNTgifQ.maLLvC5ily7BSrnmsPN3kX6aUmWPd4nTGFTNS8K2jVE';

      jest.spyOn(listMetricsService, 'execute').mockResolvedValue(mockSummary);

      const response = await request(app.getHttpServer())
        .get('/metrics')
        .set('Authorization', `Bearer ${token}`)
        .send(metricsParam)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(mockSummary);
    });

    it('should throw NotFoundException when no metrics are found', async () => {
      const metricsParam: MetricsParam = {
        last_quotes: '5',
      };

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbnBqIjoiMjU0MzgyOTYwMDAxNTgifQ.maLLvC5ily7BSrnmsPN3kX6aUmWPd4nTGFTNS8K2jVE';

      jest
        .spyOn(listMetricsService, 'execute')
        .mockRejectedValue(
          new NotFoundException('Não foram encontradas métricas.'),
        );

      const response = await request(app.getHttpServer())
        .get('/metrics')
        .set('Authorization', `Bearer ${token}`)
        .send(metricsParam)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'Não foram encontradas métricas.',
      });
    });

    it('should handle error when no authentication token is provided', async () => {
      const metricsParam: MetricsParam = {
        last_quotes: '5',
      };

      const response = await request(app.getHttpServer())
        .get('/metrics')
        .send(metricsParam)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Token de autenticação não fornecido.',
        error: 'Unauthorized',
      });
    });

    it('should handle error when authentication token is invalid', async () => {
      const metricsParam: MetricsParam = {
        last_quotes: '5',
      };

      const invalidToken = 'invalid_token';

      const response = await request(app.getHttpServer())
        .get('/metrics')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(metricsParam)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Token de autorização inválido',
        error: 'Unauthorized',
      });
    });
  });
});
