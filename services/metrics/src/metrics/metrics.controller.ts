import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ListMetricsService } from './services/list-metrics.service';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { MetricsParam } from './dto/metrics.param';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionSwagger } from '../common/swagger/http-exception.swagger';
import { ListMetricsSwagger } from '../common/swagger/list-metrics.swagger';

@ApiTags('Metrics')
@ApiBearerAuth()
@Controller('metrics')
export class MetricsController {
  constructor(private readonly listMetricsService: ListMetricsService) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  @ApiOperation({ summary: 'Listar métricas' })
  @ApiResponse({
    status: 200,
    description: 'Métricas listadas.',
    type: ListMetricsSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Não foram encontradas métricas.',
    type: HttpExceptionSwagger,
  })
  listMetrics(@Query() query: MetricsParam) {
    return this.listMetricsService.execute(query);
  }
}
