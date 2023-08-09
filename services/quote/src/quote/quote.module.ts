import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { CreateQuoteService } from './services/create-quote.service';
import { CustomHttp } from 'src/common/http/custom.http';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/common/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [QuoteController],
  providers: [CreateQuoteService, CustomHttp],
})
export class QuoteModule {}
