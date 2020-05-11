import { TransportActions } from "core/transport/actions";
import ticker from "./reducer";

describe("TickerReducer", () => {
  it("should handle update", () => {
    const currencyPair = "BTCUSD";

    const channelId = 17470;
    const [
      bid,
      bidSize,
      ask,
      askSize,
      dailyChange,
      dailyChangeRelative,
      lastPrice,
      volume,
      high,
      low,
    ] = [
      7616.5,
      31.89055171,
      7617.5,
      43.358118629999986,
      -550.8,
      -0.0674,
      7617.1,
      8314.71200815,
      8257.8,
      7500,
    ];
    const data = [
      channelId,
      [
        bid,
        bidSize,
        ask,
        askSize,
        dailyChange,
        dailyChangeRelative,
        lastPrice,
        volume,
        high,
        low,
      ],
    ];
    const meta = {
      channel: "ticker",
      request: {
        symbol: `t${currencyPair}`,
      },
    };
    const action = TransportActions.receiveMessage(data, meta);
    const result = ticker(undefined, action);
    expect(result).toEqual({
      [currencyPair]: {
        currencyPair,
        bid,
        bidSize,
        ask,
        askSize,
        dailyChange,
        dailyChangeRelative,
        lastPrice,
        volume,
        high,
        low,
      },
    });
  });
});
