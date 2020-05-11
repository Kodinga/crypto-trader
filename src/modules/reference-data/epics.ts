import { Epic, ofType, combineEpics } from "redux-observable";
import { switchMap, map, catchError } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { of } from "rxjs";
import { Dependencies } from "modules/redux/store";
import { RootState, Actions } from "modules/root";
import { REF_DATA_ACTION_TYPES, RefDataActions, LoadRefData } from "./actions";

export const loadRefData: Epic<Actions, Actions, RootState, Dependencies> = (
  action$
) =>
  action$.pipe(
    ofType<Actions, LoadRefData>(REF_DATA_ACTION_TYPES.LOAD_REF_DATA),
    switchMap(() => {
      return fromFetch("data/currencyPairs.json").pipe(
        switchMap((response) => response.json()),
        map((result) =>
          RefDataActions.loadRefDataAck({
            currencyPairs: result as string[],
          })
        ),
        catchError(() => of(RefDataActions.loadRefDataNack()))
      );
    })
  );

export default combineEpics(loadRefData);
