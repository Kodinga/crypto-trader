import { merge, of, from, EMPTY } from "rxjs";
import { Epic, combineEpics } from "redux-observable";
import {
  switchMap,
  take,
  mergeMap,
  filter,
  map,
  tap,
  distinctUntilChanged,
} from "rxjs/operators";
import { ofType } from "ts-action-operators";
import { Actions } from "modules/root";
import { AppActions } from "modules/app/actions";
import { ConnectionStatus } from "core/transport/types/ConnectionStatus";
import { getCurrencyPairs } from "modules/reference-data/selectors";
import { RefDataActions } from "modules/reference-data/actions";
import { Dependencies } from "modules/redux/store";
import { SelectionActions } from "modules/selection/actions";
import { TransportActions } from "core/transport/actions";
import { parseCurrencyPair } from "modules/reference-data/utils";
import { TickerActions } from "modules/ticker/actions";
import { CandlesActions } from "modules/candles/actions";
import { RootState } from "./../root";
import { getSelectedCurrencyPair } from "./../selection/selectors";

const bootstrap: Epic<Actions, Actions, RootState, Dependencies> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(AppActions.bootstrapApp),
    switchMap(() => {
      console.log("Bootstrap App");

      return merge(
        action$.pipe(
          ofType(TransportActions.changeConnectionStatus),
          filter((action) => action.payload === ConnectionStatus.Connected),
          switchMap(() =>
            merge(
              of(RefDataActions.loadRefData()),
              action$.pipe(
                ofType(RefDataActions.loadRefDataAck),
                take(1),
                mergeMap(() => {
                  const currencyPairs = getCurrencyPairs(state$.value);
                  const selectionActions = [
                    SelectionActions.selectCurrencyPair({
                      currencyPair:
                        getSelectedCurrencyPair(state$.value) ||
                        currencyPairs[0],
                    }),
                  ];

                  const tickerActions = currencyPairs.map((currencyPair) =>
                    TickerActions.subscribeToTicker({
                      symbol: currencyPair,
                    })
                  );
                  const candleActions = currencyPairs.map((currencyPair) =>
                    CandlesActions.subscribeToCandles({
                      symbol: currencyPair,
                      timeframe: "5m",
                    })
                  );

                  return merge(
                    from(selectionActions),
                    from(tickerActions),
                    from(candleActions)
                  );
                })
              )
            )
          )
        ),
        of(
          TransportActions.init({
            wsEndpoint: "wss://api-pub.bitfinex.com/ws/2",
          })
        )
      );
    })
  );

const updateTitle: Epic<Actions, Actions, RootState, Dependencies> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(SelectionActions.selectCurrencyPair),
    switchMap((action) => {
      const { currencyPair } = action.payload;
      const [, counter] = parseCurrencyPair(currencyPair);

      return state$.pipe(
        map((state) => state.ticker[currencyPair]),
        distinctUntilChanged(),
        filter((ticker) => typeof ticker !== "undefined"),
        tap(
          (ticker) =>
            (document.title = `(${ticker.lastPrice?.toFixed(
              2
            )} ${counter}) Crypto Trader`)
        ),
        mergeMap(() => EMPTY)
      );
    })
  );

export default combineEpics(bootstrap, updateTitle);
