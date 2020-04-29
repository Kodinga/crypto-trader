import { ActionCreatorsMapObject } from 'redux';

export interface Action<T extends string> {
    type: T;
};

export interface ActionWithPayload<T extends string, P> extends Action<T> {
    payload: P;
}

export interface ActionWithPayloadAndMeta<T extends string, P, M> extends ActionWithPayload<T, P> {
    meta: M;
}

type ActionFn<T extends string> = () => Action<T>;

type ActionWithPayloadFn<T extends string, P> = (payload: P) => ActionWithPayload<T, P>;

type ActionWithPayloadAndMetaFn<T extends string, P, M> = (payload: P, meta: M) => ActionWithPayloadAndMeta<T, P, M>;

export function createAction<T extends string>(type: T): ActionFn<T>;

export function createAction<T extends string, P>(type: T): ActionWithPayloadFn<T, P>;

export function createAction<T extends string, P, M>(type: T): ActionWithPayloadAndMetaFn<T, P, M>;

export function createAction(type: string) {
    return (payload?: any, meta?: any) => {
        if (typeof payload === 'undefined') {
            return { type };
        }
        if (typeof meta === 'undefined') {
            return {
                type,
                payload
            };
        }

        return {
            type,
            payload,
            meta
        };
    }
};

export type ActionUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>
