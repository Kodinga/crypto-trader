export const getLookupKey = (currencyPair: string, timeframe: string) =>
  [currencyPair, timeframe].join(":");
