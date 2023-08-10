import { ApiProperty } from '@nestjs/swagger';

class CarrierMetricsSwagger {
  @ApiProperty()
  carrier: string;

  @ApiProperty()
  total_quotes: number;

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  average_price: number;

  @ApiProperty()
  cheapest_price: number;

  @ApiProperty()
  highest_price: number;
}

class GlobalMetricsSwagger {
  @ApiProperty()
  average_price: number;

  @ApiProperty()
  total_quotes: number;

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  cheapest_price: number;

  @ApiProperty()
  highest_price: number;
}

export class ListMetricsSwagger {
  @ApiProperty({ type: [CarrierMetricsSwagger] })
  carriers: CarrierMetricsSwagger[];

  @ApiProperty()
  global_metrics: GlobalMetricsSwagger;
}
