import { RefDataActions, RefDataLoad } from './../reference-data/actions';
import { RootState } from './../root';
import { Dependencies } from './../redux/store';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { APP_ACTION_TYPES, BoostrapApp } from './actions';
import { from } from 'rxjs';

const bootstrap: Epic<BoostrapApp | RefDataLoad, RefDataLoad, RootState, Dependencies> = (action$, state$, {connection}) =>
  action$.pipe(
    ofType(APP_ACTION_TYPES.BOOTSTRAP_APP),
    switchMap(() => {
        console.log('Boostrap App');
        connection.connect();
        return from([
          RefDataActions.refDataLoad()
        ]);
    })
  );
    
export default combineEpics(
    bootstrap
);