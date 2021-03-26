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

export type ActionUnion<A extends ActionCreatorsMapObject> = ReturnType<
  A[keyof A]
>;
