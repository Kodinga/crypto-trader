import { TransportActions } from "core/transport/actions";
import { getLookupKey } from "./utils";
import candles from "./reducer";

describe("CandlesReducer", () => {
  it("should handle snapshot", () => {
    const currencyPair = "BTCUSD";
    const timeframe = "1m";
    const lookupKey = getLookupKey(currencyPair, timeframe);
    const channelId = 17470;
    const [timestamp, open, close, high, low, volume] = [
      1574698260000,
      7379.785503,
      7383.8,
      7388.3,
      7379.785503,
      1.68829482,
    ];
    const data = [channelId, [[timestamp, open, close, high, low, volume]]];
    const meta = {
      channel: "candles",
      request: {
        key: `trade:${timeframe}:t${currencyPair}`,
      },
    };
    const action = TransportActions.receiveMessage(data, meta);
    const result = candles(undefined, action);
    expect(result).toEqual({
      [lookupKey]: [{ timestamp, open, close, high, low, volume }],
    });
  });

  it("should handle insert", () => {
    const currencyPair = "BTCUSD";
    const timeframe = "1m";
    const lookupKey = getLookupKey(currencyPair, timeframe);
    const initialState = {
      [lookupKey]: [
        {
          timestamp: 1574698260000,
          open: 7379,
          close: 7392,
          high: 7401,
          low: 7378,
          volume: 1.7,
        },
      ],
    };

    const channelId = 17470;
    const [timestamp, open, close, high, low, volume] = [
      1574698280000,
      7399.9,
      7379.7,
      7399.9,
      7371.8,
      41.63633658,
    ];
    const data = [channelId, [timestamp, open, close, high, low, volume]];
    const meta = {
      channel: "candles",
      request: {
        key: `trade:${timeframe}:t${currencyPair}`,
      },
    };
    const action = TransportActions.receiveMessage(data, meta);
    const result = candles(initialState, action);
    expect(result).toEqual({
      [lookupKey]: [
        { timestamp, open, close, high, low, volume },
        {
          timestamp: 1574698260000,
          open: 7379,
          close: 7392,
          high: 7401,
          low: 7378,
          volume: 1.7,
        },
      ],
    });
  });

  it("should handle upsert", () => {
    const currencyPair = "BTCUSD";
    const timeframe = "1m";
    const lookupKey = getLookupKey(currencyPair, timeframe);
    const timestamp = 1574698260000;
    const initialState = {
      [lookupKey]: [
        {
          timestamp,
          open: 7379,
          close: 7392,
          high: 7401,
          low: 7378,
          volume: 1.7,
        },
      ],
    };

    const channelId = 17470;
    const [open, close, high, low, volume] = [
      7399.9,
      7379.7,
      7399.9,
      7371.8,
      41.63633658,
    ];
    const data = [channelId, [timestamp, open, close, high, low, volume]];
    const meta = {
      channel: "candles",
      request: {
        key: `trade:${timeframe}:t${currencyPair}`,
      },
    };
    const action = TransportActions.receiveMessage(data, meta);
    const result = candles(initialState, action);
    expect(result).toEqual({
      [lookupKey]: [{ timestamp, open, close, high, low, volume }],
    });
  });

  it("should discard heartbeat", () => {
    const currencyPair = "BTCUSD";
    const timeframe = "1m";
    const lookupKey = getLookupKey(currencyPair, timeframe);
    const initialState = {
      [lookupKey]: [
        {
          timestamp: 1574698260000,
          open: 7379,
          close: 7392,
          high: 7401,
          low: 7378,
          volume: 1.7,
        },
      ],
    };

    const channelId = 17470;
    const data = [channelId, "hb"];
    const meta = {
      channel: "candles",
      request: {
        key: `trade:${timeframe}:t${currencyPair}`,
      },
    };
    const action = TransportActions.receiveMessage(data, meta);
    const result = candles(initialState, action);
    expect(result).toBe(initialState);
  });

  it("should clear state on unsubscription", () => {
    const currencyPair = "BTCUSD";
    const otherKey = "BTCEUR:2m";
    const timeframe = "1m";
    const lookupKey = getLookupKey(currencyPair, timeframe);
    const initialState = {
      [lookupKey]: [
        {
          timestamp: 1574698260000,
          open: 7379,
          close: 7392,
          high: 7401,
          low: 7378,
          volume: 1.7,
        },
      ],
      [otherKey]: [],
    };

    const channelId = 17470;
    const data = {
      event: "unsubscribed",
      chanId: channelId,
    };
    const meta = {
      channel: "candles",
      request: {
        key: `trade:${timeframe}:t${currencyPair}`,
      },
    };
    const action = TransportActions.receiveMessage(data, meta);
    const result = candles(initialState, action);
    expect(result).toEqual({
      [otherKey]: [],
    });
  });
});
