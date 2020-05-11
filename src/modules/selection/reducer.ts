import { createReducer } from 'modules/redux/utils';
import { Actions } from 'modules/root';
import { SELECTION_ACTION_TYPES, SelectCurrencyPair } from './actions';

interface SelectionState {
    currencyPair?: string;
}

const initialState: SelectionState = {
}

const selectCurrencyPair = (state: SelectionState, action: SelectCurrencyPair) => {
    const { currencyPair } = action.payload;

    return {
        ...state,
        currencyPair
    };
}

export const selectionReducer = createReducer<SelectionState, Actions>({
    [SELECTION_ACTION_TYPES.SELECT_CURRENCY_PAIR]: selectCurrencyPair
}, initialState);

export default selectionReducer;