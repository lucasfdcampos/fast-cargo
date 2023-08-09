import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { join } from 'path';
import { Account } from './common/entities/account.entity';
import { QuoteModule } from './quote/quote.module';
import { Quote } from './quote/entities/quote.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    TypeOrmModule.forRoot({
      ...config,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Account, Quote]),
    QuoteModule,
  ],
})
export class AppModule {}
