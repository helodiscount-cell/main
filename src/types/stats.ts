export interface BestPerformerStats {
  id: string;
  date: string;
  value: number;
  imageUrl: string;
}

export interface BestTimeStats {
  imageUrl: string;
  fullDate: string;
  day: string;
  timeWindow: string;
}

export interface BestPerformerWidgetConfig {
  title: string;
  dropdownOptions: string[];
  chartData: BestPerformerStats[];
  bestTimeData: BestTimeStats;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface OutreachImpactResponse {
  count: number;
  data: ChartDataPoint[];
}

export interface FollowerGrowthResponse {
  growth: number;
  data: ChartDataPoint[];
}
