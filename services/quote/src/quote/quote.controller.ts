import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { CreateQuoteService } from './services/create-quote.service';
import {
  AccountData,
  AccountType,
} from 'src/common/decorators/account.decorator';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';

@Controller('quote')
export class QuoteController {
  constructor(private readonly createQuoteService: CreateQuoteService) {}

  @Post()
  @UseGuards(AuthorizationGuard)
  create(
    @Body() createQuoteDto: CreateQuoteDto,
    @AccountData() accountData: AccountType,
  ) {
    return this.createQuoteService.execute(createQuoteDto, accountData);
  }
}
