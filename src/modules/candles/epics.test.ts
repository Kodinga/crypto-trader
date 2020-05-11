import { TestScheduler } from "rxjs/testing";
import { TransportActions } from "core/transport/actions";
import { Dependencies } from "modules/redux/store";
import { wrapHelpers } from "testing/utils";
import {
  CandlesActions,
  SubscribeToCandles,
  UnsubscribeFromCandles,
} from "./actions";
import { subscribeToCandles, unsubscribeFromCandles } from "./epics";

describe("CandlesEpic", () => {
  describe("subscribeToCandles()", () => {
    it("should subscribe to symbol", async () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });

      testScheduler.run((helpers) => {
        const { hotAction, hotState, expectObservable } = wrapHelpers<
          SubscribeToCandles,
          any
        >(helpers, {});
        const currencyPair = "BTCUSD";
        const timeframe = "1m";
        const action$ = hotAction("-a", {
          a: CandlesActions.subscribeToCandles({
            symbol: currencyPair,
            timeframe,
          }),
        });
        const state$ = hotState("-");

        const output$ = subscribeToCandles(
          action$,
          state$,
          ({} as unknown) as Dependencies
        );

        expectObservable(output$).toBe("-a", {
          a: TransportActions.subscribeToChannel({
            channel: "candles",
            key: `trade:${timeframe}:t${currencyPair}`,
          }),
        });
      });
    });
  });

  describe("unsubscribeFromCandles()", () => {
    it("should unsubscribe from symbol", async () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });

      testScheduler.run((helpers) => {
        const currencyPair = "BTCUSD";
        const timeframe = "1m";
        const channelId = 10;
        const { hotAction, hotState, expectObservable } = wrapHelpers<
          UnsubscribeFromCandles,
          any
        >(helpers, {
          subscriptions: {
            [channelId]: {
              channel: "candles",
              request: {
                currencyPair,
                key: `trade:${timeframe}:t${currencyPair}`,
              },
            },
          },
        });

        const action$ = hotAction("-a", {
          a: CandlesActions.unsubscribeFromCandles({
            symbol: currencyPair,
            timeframe,
          }),
        });
        const state$ = hotState("");

        const output$ = unsubscribeFromCandles(
          action$,
          state$,
          ({} as unknown) as Dependencies
        );

        expectObservable(output$).toBe("-a", {
          a: TransportActions.unsubscribeFromChannel({
            channelId,
          }),
        });
      });
    });
  });
});
