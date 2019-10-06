export type AnalyticData = {
  location: { location: string; visits: number; type: string }[];
  dates: { date: Date; visits: number }[];
  totalVisits: number;
};

export type ChartData = {
  date: Date;
  visits: number;
};

export type ListData = {
  location: string;
  visits: number;
  type: string;
};
