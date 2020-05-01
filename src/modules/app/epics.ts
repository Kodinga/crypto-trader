import { ConnectionStatus } from './../../core/transport/types/ConnectionStatus';
import { getCurrencyPairs } from './../reference-data/selectors';
import { Actions } from 'modules/root';
import { TickerActions } from './../ticker/actions';
import { RefDataActions, REF_DATA_ACTION_TYPES } from './../reference-data/actions';
import { RootState } from './../root';
import { Dependencies } from './../redux/store';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { switchMap, take, mergeMap, concatMap, delay, filter } from 'rxjs/operators';
import { APP_ACTION_TYPES } from './actions';
import { merge, of, from } from 'rxjs';
import { TradeActions } from 'modules/trades/actions';
import { WS_ACTION_TYPES, WsConnectionStatusChanged } from 'core/transport/actions';
import { CandleActions } from 'modules/candles/actions';

const bootstrap: Epic<Actions, Actions, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(APP_ACTION_TYPES.BOOTSTRAP_APP),
    switchMap(() => {
      console.log('Boostrap App');
      connection.connect();

      return action$.pipe(
        ofType(WS_ACTION_TYPES.WS_CONNECTION_STATUS_CHANGED),
        filter(action => (action as WsConnectionStatusChanged).payload === ConnectionStatus.Connected),
        switchMap(() => merge(
          of(RefDataActions.refDataLoad()),
          action$.pipe(
            ofType(REF_DATA_ACTION_TYPES.REF_DATA_LOAD_ACK),
            take(1),
            mergeMap(() => {
              const currencyPairs = getCurrencyPairs(state$.value);
              const tickerActions = currencyPairs
                .map(currencyPair => TickerActions.subscribeToSymbol({
                  symbol: currencyPair
                }));
              const candlesActions = [
                CandleActions.subscribeToSymbol({ symbol: currencyPairs[0], timeframe: '1M'})
              ];
              const tradeActions = [
                TradeActions.subscribeToSymbol({ symbol: currencyPairs[0] })
              ];
              return merge(
                from(tradeActions),
                from(candlesActions),
                from(tickerActions)
                  .pipe(
                    // TODO - due to limitations with the Bitfinex WS protocol, we can't do concurrent subscriptions here (cf transport epic)
                    concatMap(action => of(action).pipe(delay(200)))
                  )
              );
            })
          )
        )));
    })
  );

export default combineEpics(
  bootstrap
);