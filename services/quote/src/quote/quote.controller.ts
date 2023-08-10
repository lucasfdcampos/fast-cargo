import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { CreateQuoteService } from './services/create-quote.service';
import {
  AccountData,
  AccountType,
} from 'src/common/decorators/account.decorator';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionSwagger } from 'src/common/swagger/http-exception.swagger';
import { CreateQuoteSwagger } from 'src/common/swagger/create-quote.swagger';
import { BadRequestSwagger } from 'src/common/swagger/bad-request.swagger';

@ApiTags('Quotes')
@ApiBearerAuth()
@Controller('quote')
export class QuoteController {
  constructor(private readonly createQuoteService: CreateQuoteService) {}

  @Post()
  @UseGuards(AuthorizationGuard)
  @ApiOperation({ summary: 'Realizar cotação' })
  @ApiResponse({
    status: 201,
    description: 'Ofertas encontradas e criadas.',
    type: CreateQuoteSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Não foram encontradas ofertas para a rota informada.',
    type: HttpExceptionSwagger,
  })
  create(
    @Body() createQuoteDto: CreateQuoteDto,
    @AccountData() accountData: AccountType,
  ) {
    return this.createQuoteService.execute(createQuoteDto, accountData);
  }
}
