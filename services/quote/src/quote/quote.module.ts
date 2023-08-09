import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { CreateQuoteService } from './services/create-quote.service';
import { CustomHttp } from 'src/common/http/custom.http';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/common/entities/account.entity';
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
    CustomHttp,
    {
      provide: QuoteRepositoryToken,
      useClass: QuoteRepositoryImpl,
    },
  ],
})
export class QuoteModule {}
