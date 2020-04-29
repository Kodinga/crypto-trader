import { RootState } from './../root';
import { Dependencies } from './../redux/store';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { APP_ACTION_TYPES, BoostrapAppAction } from './actions';

const bootstrap: Epic<BoostrapAppAction, BoostrapAppAction, RootState, Dependencies> = (action$, state$, {connection}) =>
  action$.pipe(
    ofType(APP_ACTION_TYPES.BOOTSTRAP_APP),
    switchMap(() => {
        console.log('Boostrap App');
        connection.connect();
        return EMPTY;
    })
  );
    
export default combineEpics(
    bootstrap
);