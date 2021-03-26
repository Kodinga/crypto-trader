import { Epic, combineEpics } from "redux-observable";
import { ofType } from "ts-action-operators";
import { switchMap, map, catchError } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { of } from "rxjs";
import { Dependencies } from "modules/redux/store";
import { RootState, Actions } from "modules/root";
import { RefDataActions } from "./actions";

export const loadRefData: Epic<Actions, Actions, RootState, Dependencies> = (
  action$
) =>
  action$.pipe(
    ofType(RefDataActions.loadRefData),
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
