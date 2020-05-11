import { TransportActions } from "core/transport/actions";
import trades from "./reducer";

describe("TradesReducer", () => {
  it("should handle snapshot", () => {
    const currencyPair = "BTCUSD";
    const channelId = 17470;
    const [trade1Id, trade1Timestamp, trade1Amount, trade1Price] = [
      1,
      1574694475039,
      0.005,
      7244.9,
    ];
    const [trade2Id, trade2Timestamp, trade2Amount, trade2Price] = [
      2,
      1574694475040,
      0.01,
      7242.1,
    ];
    const data = [
      channelId,
      [
        [trade1Id, trade1Timestamp, trade1Amount, trade1Price],
        [trade2Id, trade2Timestamp, trade2Amount, trade2Price],
      ],
    ];
    const meta = {
      channel: "trades",
      request: {
        symbol: `t${currencyPair}`,
      },
    };
    const action = TransportActions.receiveMessage(data, meta);
    const result = trades(undefined, action);
    expect(result).toEqual({
      [currencyPair]: [
        {
          id: trade2Id,
          timestamp: trade2Timestamp,
          amount: trade2Amount,
          price: trade2Price,
        },
        {
          id: trade1Id,
          timestamp: trade1Timestamp,
          amount: trade1Amount,
          price: trade1Price,
        },
      ],
    });
  });

  it("should handle insert", () => {
    const currencyPair = "BTCUSD";
    const initialState = {
      [currencyPair]: [
        { id: 1, timestamp: 1574694475039, amount: 0.005, price: 7244.9 },
      ],
    };

    const channelId = 17470;
    const [id, timestamp, amount, price] = [2, 1574694478808, 0.005, 7245.3];
    const data = [channelId, "tu", [id, timestamp, amount, price]];
    const meta = {
      channel: "trades",
      request: {
        symbol: `t${currencyPair}`,
      },
    };
    const action = TransportActions.receiveMessage(data, meta);
    const result = trades(initialState, action);
    expect(result).toEqual({
      [currencyPair]: [
        { id, timestamp, amount, price },
        { id: 1, timestamp: 1574694475039, amount: 0.005, price: 7244.9 },
      ],
    });
  });

  it("should handle upsert", () => {
    const currencyPair = "BTCUSD";
    const initialState = {
      [currencyPair]: [
        { id: 1, timestamp: 1574694475039, amount: 0.005, price: 7244.9 },
        { id: 2, timestamp: 1574694478808, amount: 0.005, price: 7245.9 },
      ],
    };

    const channelId = 17470;
    const [id, timestamp, amount, price] = [2, 1574694478808, 0.01, 7250.1];
    const data = [channelId, "tu", [id, timestamp, amount, price]];
    const meta = {
      channel: "trades",
      request: {
        symbol: `t${currencyPair}`,
      },
    };
    const action = TransportActions.receiveMessage(data, meta);
    const result = trades(initialState, action);
    expect(result).toEqual({
      [currencyPair]: [
        { id: 1, timestamp: 1574694475039, amount: 0.005, price: 7244.9 },
        { id, timestamp, amount, price },
      ],
    });
  });

  it("should discard heartbeat", () => {
    const symbol = "tBTCUSD";
    const initialState = {
      [symbol.slice(1)]: [
        { id: 2, timestamp: 1574694478808, amount: 0.005, price: 7245.9 },
        { id: 1, timestamp: 1574694475039, amount: 0.005, price: 7244.9 },
      ],
    };

    const channelId = 17470;
    const data = [channelId, "hb"];
    const meta = {
      channel: "trades",
      request: {
        symbol,
      },
    };
    const action = TransportActions.receiveMessage(data, meta);
    const result = trades(initialState, action);
    expect(result).toBe(initialState);
  });

  it("should clear state on unsubscription", () => {
    const currencyPair = "BTCUSD";
    const otherCurrencyPair = "BTCEUR";
    const initialState = {
      [currencyPair]: [
        { id: 2, timestamp: 1574694478808, amount: 0.005, price: 7245.9 },
        { id: 1, timestamp: 1574694475039, amount: 0.005, price: 7244.9 },
      ],
      [otherCurrencyPair]: [],
    };

    const channelId = 17470;
    const data = {
      event: "unsubscribed",
      chanId: channelId,
    };
    const meta = {
      channel: "trades",
      request: {
        symbol: `t${currencyPair}`,
      },
    };
    const action = TransportActions.receiveMessage(data, meta);
    const result = trades(initialState, action);
    expect(result).toEqual({
      [otherCurrencyPair]: [],
    });
  });
});
