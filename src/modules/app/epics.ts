import { merge, of, from, EMPTY } from 'rxjs';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { switchMap, take, mergeMap, filter, map, tap, distinctUntilChanged } from 'rxjs/operators';
import { Actions } from 'modules/root';
import { ConnectionStatus } from 'core/transport/types/ConnectionStatus';
import { getCurrencyPairs } from 'modules/reference-data/selectors';
import { RefDataActions, REF_DATA_ACTION_TYPES } from 'modules/reference-data/actions';
import { Dependencies } from 'modules/redux/store';
import { SelectionActions } from 'modules/selection/actions';
import { TRANSPORT_ACTION_TYPES, ChangeConnectionStatus } from 'core/transport/actions';
import { parseCurrencyPair } from 'modules/reference-data/utils';
import { TickerActions } from 'modules/ticker/actions';
import { CandlesActions } from 'modules/candles/actions';
import { RootState } from './../root';
import { APP_ACTION_TYPES, BoostrapApp } from './actions';
import { LoadRefDataAck } from './../reference-data/actions';
import { SELECTION_ACTION_TYPES, SelectCurrencyPair } from './../selection/actions';

const bootstrap: Epic<Actions, Actions, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType<Actions, BoostrapApp>(APP_ACTION_TYPES.BOOTSTRAP_APP),
    switchMap(() => {
      console.log('Bootstrap App');
      connection.connect();

      return action$.pipe(
        ofType<Actions, ChangeConnectionStatus>(TRANSPORT_ACTION_TYPES.CHANGE_CONNECTION_STATUS),
        filter(action => action.payload === ConnectionStatus.Connected),
        switchMap(() => merge(
          of(RefDataActions.loadRefData()),
          action$.pipe(
            ofType<Actions, LoadRefDataAck>(REF_DATA_ACTION_TYPES.LOAD_REF_DATA_ACK),
            take(1),
            mergeMap(() => {
              const currencyPairs = getCurrencyPairs(state$.value);
              const tickerActions = currencyPairs
                .map(currencyPair => TickerActions.subscribeToTicker({
                  symbol: currencyPair
                }));
                const candleActions = currencyPairs
                .map(currencyPair => CandlesActions.subscribeToCandles({ symbol: currencyPair, timeframe: '5m' }));

              return merge(
                of(SelectionActions.selectCurrencyPair({ currencyPair: currencyPairs[0] })),
                from(tickerActions),
                from(candleActions)
              );
            })
          )
        )));
    })
  );

const updateTitle: Epic<Actions, Actions, RootState, Dependencies> = (action$, state$) =>
  action$
    .pipe(
      ofType(SELECTION_ACTION_TYPES.SELECT_CURRENCY_PAIR),
      switchMap(action => {
        const { currencyPair } = (action as SelectCurrencyPair).payload;
        const [, counter] = parseCurrencyPair(currencyPair);

        return state$
          .pipe(
            map(state => state.ticker[currencyPair]),
            distinctUntilChanged(),
            filter(ticker => typeof ticker !== 'undefined'),
            tap(ticker => document.title = `(${ticker.lastPrice?.toFixed(2)} ${counter}) Crypto Trader`),
            mergeMap(() => EMPTY)
          );
      })
    );

export default combineEpics(
  bootstrap,
  updateTitle
);