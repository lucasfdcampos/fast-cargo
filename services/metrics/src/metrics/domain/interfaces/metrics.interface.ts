interface ICarrierMetrics {
  carrier: string;
  total_quotes: number;
  total_price: number;
  average_price: number;
  cheapest_price: number;
  highest_price: number;
}

interface IGlobalMetrics {
  average_price: number;
  total_quotes: number;
  total_price: number;
  cheapest_price: number;
  highest_price: number;
}

export interface IMetricsSummary {
  carriers: ICarrierMetrics[];
  global_metrics: IGlobalMetrics;
}
