import { from } from 'rxjs';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { Actions } from 'modules/root';
import { TradesActions } from 'modules/trades/actions';
import { CandlesActions } from 'modules/candles/actions';
import { BookActions } from 'modules/book/actions';
import { RootState } from './../root';
import { Dependencies } from './../redux/store';
import { SELECTION_ACTION_TYPES, SelectCurrencyPair } from './actions';

const handleSelection: Epic<Actions, Actions, RootState, Dependencies> = (action$) =>
  action$.pipe(
    ofType(SELECTION_ACTION_TYPES.SELECT_CURRENCY_PAIR),
    switchMap(action => {
      const { currencyPair } = (action as SelectCurrencyPair).payload;
      
      return from([
        CandlesActions.subscribeToCandles({ symbol: currencyPair, timeframe: '1m' }),
        TradesActions.subscribeToTrades({ symbol: currencyPair }),
        BookActions.subscribeToBook({ symbol: currencyPair })
      ]);

    })
  );

export default combineEpics(
  handleSelection
);