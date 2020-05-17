import { TestScheduler } from "rxjs/testing";
import { Dependencies } from "modules/redux/store";
import { wrapHelpers } from "testing/utils";
import { CandlesActions } from "modules/candles/actions";
import { TradesActions } from "modules/trades/actions";
import { BookActions } from "modules/book/actions";
import { SelectionActions, SelectCurrencyPair } from "./actions";
import { handleSelection } from "./epics";

describe("SelectionEpic", () => {
  describe("handleSelection()", () => {
    it("clear existing subscriptions before subscribing", async () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });

      testScheduler.run((helpers) => {
        const { hotAction, hotState, expectObservable } = wrapHelpers<
          SelectCurrencyPair,
          any
        >(helpers, {});
        const previousCurrencyPair = "BTCEUR";
        const currencyPair = "BTCUSD";
        const action$ = hotAction("---a", {
          a: SelectionActions.selectCurrencyPair({ currencyPair }),
        });
        const state$ = hotState("-ab", {
          a: {
            selection: {
              currencyPair: previousCurrencyPair,
            },
          },
          b: {
            selection: {
              currencyPair,
            },
          },
        });

        const output$ = handleSelection(
          action$,
          state$,
          ({} as unknown) as Dependencies
        );

        expectObservable(output$).toBe("---(abcdef)", {
          a: CandlesActions.unsubscribeFromCandles({
            symbol: previousCurrencyPair,
            timeframe: "1m",
          }),
          b: BookActions.unsubscribeFromBook({ symbol: previousCurrencyPair }),
          c: TradesActions.unsubscribeFromTrades({
            symbol: previousCurrencyPair,
          }),

          d: CandlesActions.subscribeToCandles({
            symbol: currencyPair,
            timeframe: "1m",
          }),
          e: BookActions.subscribeToBook({ symbol: currencyPair }),
          f: TradesActions.subscribeToTrades({ symbol: currencyPair }),
        });
      });
    });
  });
});
