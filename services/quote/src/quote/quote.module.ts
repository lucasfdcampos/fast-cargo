import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { CreateQuoteService } from './services/create-quote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../common/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { Quote } from './entities/quote.entity';
import { QuoteRepositoryToken } from './domain/repository/quote.repository';
import { QuoteRepositoryImpl } from './infra/repository/quote.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    TypeOrmModule.forFeature([Account, Quote]),
  ],
  controllers: [QuoteController],
  providers: [
    CreateQuoteService,
    {
      provide: QuoteRepositoryToken,
      useClass: QuoteRepositoryImpl,
    },
  ],
})
export class QuoteModule {}
