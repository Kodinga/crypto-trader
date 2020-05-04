import { createAction, ActionUnion } from '../redux/utils';

export enum SELECTION_ACTION_TYPES {
    SELECT_CURRENCY_PAIR = 'SELECTION/SELECT_CURRENCY_PAIR'
}

export interface SelectCurrencyPairActionPayload {
    currencyPair: string;
}

export const SelectionActions = {
    selectCurrencyPair: createAction<SELECTION_ACTION_TYPES.SELECT_CURRENCY_PAIR, SelectCurrencyPairActionPayload>(SELECTION_ACTION_TYPES.SELECT_CURRENCY_PAIR)
};

export type SelectionActions = ActionUnion<typeof SelectionActions>;
export type SelectCurrencyPair = ReturnType<typeof SelectionActions.selectCurrencyPair>;

