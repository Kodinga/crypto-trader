import { Actions } from 'modules/root';
import { TradeActions } from 'modules/trades/actions';
import { CandleActions } from './../candles/actions';
import { BookActions } from './../book/actions';
import { RootState } from './../root';
import { Dependencies } from './../redux/store';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { SELECTION_ACTION_TYPES, SelectCurrencyPair } from './actions';
import { from } from 'rxjs';

const handleSelection: Epic<Actions, Actions, RootState, Dependencies> = (action$, state$) =>
  action$.pipe(
    ofType(SELECTION_ACTION_TYPES.SELECT_CURRENCY_PAIR),
    switchMap(action => {
      const { currencyPair } = (action as SelectCurrencyPair).payload;
      
      return from([
        CandleActions.subscribeToSymbol({ symbol: currencyPair, timeframe: '1m' }),
        TradeActions.subscribeToSymbol({ symbol: currencyPair }),
        BookActions.subscribeToSymbol({ symbol: currencyPair })
      ]);

    })
  );

export default combineEpics(
  handleSelection
);