import { from } from 'rxjs';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { switchMap, pairwise, withLatestFrom } from 'rxjs/operators';
import { Actions } from 'modules/root';
import { TradesActions } from 'modules/trades/actions';
import { CandlesActions } from 'modules/candles/actions';
import { BookActions } from 'modules/book/actions';
import { RootState } from './../root';
import { Dependencies } from './../redux/store';
import { SELECTION_ACTION_TYPES, SelectCurrencyPair } from './actions';
import { getCurrencyPair } from './selectors';

const handleSelection: Epic<Actions, Actions, RootState, Dependencies> = (action$, state$) => {
  const statePairs$ = state$.pipe(pairwise());
  return action$.pipe(
    ofType(SELECTION_ACTION_TYPES.SELECT_CURRENCY_PAIR),
    withLatestFrom(statePairs$),
    switchMap(([action, [oldState, newState]]) => {
      const oldCurrencyPair = getCurrencyPair(oldState);
      const { currencyPair } = (action as SelectCurrencyPair).payload;
      const unsubscribeActions = [];
      if (oldCurrencyPair) {
        unsubscribeActions.push(
          CandlesActions.unsubscribeFromCandles({symbol: oldCurrencyPair, timeframe: '1m'}),
          TradesActions.unsubscribeFromTrades({ symbol: oldCurrencyPair }),
          BookActions.unsubscribeFromBook({ symbol: oldCurrencyPair })
        );
      }

      const subscribeActions = [
        CandlesActions.subscribeToCandles({ symbol: currencyPair, timeframe: '1m' }),
        TradesActions.subscribeToTrades({ symbol: currencyPair }),
        BookActions.subscribeToBook({ symbol: currencyPair })
      ]

      return from([
        ...unsubscribeActions,
        ...subscribeActions
      ]);

    })
  );
}

export default combineEpics(
  handleSelection
);