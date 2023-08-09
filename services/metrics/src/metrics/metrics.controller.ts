import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ListMetricsService } from './services/list-metrics.service';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { MetricsParam } from './dto/metrics.param';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly listMetricsService: ListMetricsService) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  listMetrics(@Query() query: MetricsParam) {
    return this.listMetricsService.execute(query);
  }
}
