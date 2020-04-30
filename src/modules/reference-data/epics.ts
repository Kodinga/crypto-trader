import { Epic, ofType, combineEpics } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';
import { of } from 'rxjs';
import { Dependencies } from 'modules/redux/store';
import { RefDataLoad, REF_DATA_ACTION_TYPES, RefDataLoadAck, RefDataLoadNack, RefDataActions } from './actions';
import { RootState } from 'modules/root';

export const loadRefData: Epic<RefDataLoad | RefDataLoadAck | RefDataLoadNack, RefDataLoadAck | RefDataLoadNack, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(REF_DATA_ACTION_TYPES.REF_DATA_LOAD),
    switchMap(() => {
      return fromFetch('/data/currencyPairs.json')
        .pipe(
          switchMap(response => response.json()),
          map(result => RefDataActions.refDataLoadAck({
            currencyPairs: result as string[]
          })),
          catchError(() => of(RefDataActions.refDataLoadNack()))
        );
    })
  );


export default combineEpics(
  loadRefData
);