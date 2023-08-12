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
import { mockMetricsParam, mockSummary, mockToken } from './mocks';
import * as request from 'supertest';
import * as dotenv from 'dotenv';

dotenv.config();

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
      jest.spyOn(listMetricsService, 'execute').mockResolvedValue(mockSummary);

      const response = await request(app.getHttpServer())
        .get('/metrics')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(mockMetricsParam)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(mockSummary);
    });

    it('should throw NotFoundException when no metrics are found', async () => {
      jest
        .spyOn(listMetricsService, 'execute')
        .mockRejectedValue(
          new NotFoundException('Não foram encontradas métricas.'),
        );

      const response = await request(app.getHttpServer())
        .get('/metrics')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(mockMetricsParam)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'Não foram encontradas métricas.',
      });
    });

    it('should handle error when no authentication token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/metrics')
        .send(mockMetricsParam)
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
        .get('/metrics')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(mockMetricsParam)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Token de autorização inválido',
        error: 'Unauthorized',
      });
    });
  });
});
