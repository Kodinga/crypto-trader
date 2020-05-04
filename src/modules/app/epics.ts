import { merge, of, from } from 'rxjs';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { switchMap, take, mergeMap, filter } from 'rxjs/operators';
import { Actions } from 'modules/root';
import { ConnectionStatus } from 'core/transport/types/ConnectionStatus';
import { getCurrencyPairs } from 'modules/reference-data/selectors';
import { RefDataActions, REF_DATA_ACTION_TYPES } from 'modules/reference-data/actions';
import { Dependencies } from 'modules/redux/store';
import { SelectionActions } from 'modules/selection/actions';
import { TRANSPORT_ACTION_TYPES, ChangeConnectionStatus } from 'core/transport/actions';
import { TickerActions } from 'modules/ticker/actions';
import { RootState } from './../root';
import { APP_ACTION_TYPES } from './actions';

const bootstrap: Epic<Actions, Actions, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(APP_ACTION_TYPES.BOOTSTRAP_APP),
    switchMap(() => {
      console.log('Boostrap App');
      connection.connect();

      return action$.pipe(
        ofType(TRANSPORT_ACTION_TYPES.CHANGE_CONNECTION_STATUS),
        filter(action => (action as ChangeConnectionStatus).payload === ConnectionStatus.Connected),
        switchMap(() => merge(
          of(RefDataActions.loadRefData()),
          action$.pipe(
            ofType(REF_DATA_ACTION_TYPES.LOAD_REF_DATA_ACK),
            take(1),
            mergeMap(() => {
              const currencyPairs = getCurrencyPairs(state$.value);
              const tickerActions = currencyPairs
                .map(currencyPair => TickerActions.subscribeToTicker({
                  symbol: currencyPair
                }));
              return merge(
                of(SelectionActions.selectCurrencyPair({currencyPair: currencyPairs[0]})),
                from(tickerActions)
              );
            })
          )
        )));
    })
  );

export default combineEpics(
  bootstrap
);