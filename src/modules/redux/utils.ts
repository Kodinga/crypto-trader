import { ActionCreatorsMapObject } from "redux";

export interface Action<T extends string> {
  type: T;
}

export interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P;
}

export interface ActionWithPayloadAndMeta<T extends string, P, M>
  extends ActionWithPayload<T, P> {
  meta: M;
}

type ActionFn<T extends string> = () => Action<T>;

type ActionWithPayloadFn<T extends string, P> = (
  payload: P
) => ActionWithPayload<T, P>;

type ActionWithPayloadAndMetaFn<T extends string, P, M> = (
  payload: P,
  meta: M
) => ActionWithPayloadAndMeta<T, P, M>;

export function createAction<T extends string>(type: T): ActionFn<T>;

export function createAction<T extends string, P>(
  type: T
): ActionWithPayloadFn<T, P>;

export function createAction<T extends string, P, M>(
  type: T
): ActionWithPayloadAndMetaFn<T, P, M>;

export function createAction(type: string) {
  return (payload?: any, meta?: any) => {
    if (typeof payload === "undefined") {
      return { type };
    }
    if (typeof meta === "undefined") {
      return {
        type,
        payload,
      };
    }

    return {
      type,
      payload,
      meta,
    };
  };
}

export type ActionUnion<A extends ActionCreatorsMapObject> = ReturnType<
  A[keyof A]
>;

type ReducerMap<S, A> = A extends ActionWithPayloadAndMeta<
  infer T,
  infer P,
  infer M
>
  ? { [key in T]: (state: S, action: ActionWithPayloadAndMeta<T, P, M>) => S }
  : A extends ActionWithPayload<infer T, infer P>
  ? { [key in T]: (state: S, action: ActionWithPayload<T, P>) => S }
  : A extends Action<infer T>
  ? { [key in T]: (state: S, action: Action<T>) => S }
  : never;

export function createReducer<S, A extends { type: string }>(
  handlers: ReducerMap<S, A>,
  initialState: S
) {
  return function reducer(state = initialState, action: A): S {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}
