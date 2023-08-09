import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './common/entities/account.entity';
import { Quote } from './common/entities/quote.entity';
import { config } from './orm.config';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    TypeOrmModule.forRoot({
      ...config,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Account, Quote]),
    MetricsModule,
  ],
})
export class AppModule {}
