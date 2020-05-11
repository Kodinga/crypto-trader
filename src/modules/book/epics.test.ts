import { TestScheduler } from "rxjs/testing";
import { TransportActions } from "core/transport/actions";
import { Dependencies } from "modules/redux/store";
import { wrapHelpers } from "testing/utils";
import { BookActions, SubscribeToBook, UnsubscribeFromBook } from "./actions";
import { subscribeToBook, unsubscribeFromBook } from "./epics";

describe("BookEpic", () => {
  describe("subscribeToBook()", () => {
    it("should subscribe to symbol", async () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });

      testScheduler.run((helpers) => {
        const { hotAction, hotState, expectObservable } = wrapHelpers<
          SubscribeToBook,
          any
        >(helpers, {});
        const currencyPair = "BTCUSD";
        const action$ = hotAction("-a", {
          a: BookActions.subscribeToBook({ symbol: currencyPair }),
        });
        const state$ = hotState("-");

        const output$ = subscribeToBook(
          action$,
          state$,
          ({} as unknown) as Dependencies
        );

        expectObservable(output$).toBe("-a", {
          a: TransportActions.subscribeToChannel({
            channel: "book",
            symbol: `t${currencyPair}`,
            prec: "R0",
          }),
        });
      });
    });
  });

  describe("unsubscribeFromBook()", () => {
    it("should unsubscribe from symbol", async () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });

      testScheduler.run((helpers) => {
        const currencyPair = "BTCUSD";
        const channelId = 10;
        const { hotAction, hotState, expectObservable } = wrapHelpers<
          UnsubscribeFromBook,
          any
        >(helpers, {
          subscriptions: {
            [channelId]: {
              channel: "book",
              request: {
                symbol: `t${currencyPair}`,
              },
            },
          },
        });

        const action$ = hotAction("-a", {
          a: BookActions.unsubscribeFromBook({ symbol: currencyPair }),
        });
        const state$ = hotState("");

        const output$ = unsubscribeFromBook(
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
