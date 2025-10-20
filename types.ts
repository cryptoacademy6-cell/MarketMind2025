export type Language = 'ar' | 'en';

export interface NewsItem {
  title: string;
  source: string;
  link: string;
  summary: string;
}

export interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
  trendingKeywords: string[];
}

export interface MarketData {
  currentPrice: number;
  priceChange: number;
  priceChangePercentage: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
  volume24h?: number;
  historicalData: { time: string; price: number }[];
  dataFreshness?: string;
}

export interface AnalysisReport {
  executiveSummary: string;
  news: NewsItem[];
  sentimentAnalysis: SentimentData;
  technicalAnalysis: string;
  priceActionReasons: string;
  confidenceScore: number;
  marketData: MarketData;
}