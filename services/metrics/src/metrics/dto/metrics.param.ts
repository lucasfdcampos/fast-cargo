import { IsNumberString, IsOptional } from 'class-validator';

export class MetricsParam {
  @IsOptional()
  @IsNumberString()
  last_quotes?: string;
}
