import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { ListMetricsService } from './services/list-metrics.service';
import { Quote } from '../common/entities/quote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsRepositoryToken } from './domain/repository/metrics.repository';
import { MetricsRepositoryImpl } from './infra/repository/metrics.repository';
import { JwtModule } from '@nestjs/jwt';
import { Account } from '../common/entities/account.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    TypeOrmModule.forFeature([Account, Quote]),
  ],
  controllers: [MetricsController],
  providers: [
    ListMetricsService,
    {
      provide: MetricsRepositoryToken,
      useClass: MetricsRepositoryImpl,
    },
  ],
})
export class MetricsModule {}
