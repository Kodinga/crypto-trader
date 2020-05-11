import { ActionsObservable, StateObservable } from "redux-observable";
import { Action } from "redux";
import { RunHelpers } from "rxjs/internal/testing/TestScheduler";

/*
    Source: https://github.com/redux-observable/redux-observable/issues/620
*/
export const wrapHelpers = <A extends Action, S extends {}>(
  helpers: RunHelpers,
  initialState: S
) => ({
  ...helpers,
  coldAction: (
    marbles: string,
    values?: { [marble: string]: A },
    error?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => new ActionsObservable(helpers.cold<A>(marbles, values, error)),
  hotAction: (
    marbles: string,
    values?: { [marble: string]: A },
    error?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => new ActionsObservable(helpers.hot<A>(marbles, values, error)),
  hotState: (
    marbles: string,
    values?: { [marble: string]: S },
    error?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) =>
    new StateObservable(helpers.hot<S>(marbles, values, error), initialState),
});
