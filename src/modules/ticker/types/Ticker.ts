export interface Ticker {
  currencyPair: string;
  bid: number;
  bidSize: number;
  ask: number;
  askSize: number;
  dailyChange: number;
  dailyChangeRelative: number;
  lastPrice: number;
  volume: number;
  high: number;
  low: number;
}
