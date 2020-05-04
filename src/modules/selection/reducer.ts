import { Actions } from 'modules/root';
import { SELECTION_ACTION_TYPES } from './actions';

interface SelectionState {
    currencyPair?: string;
}

const initialState: SelectionState = {
}

export function selectionReducer(
    state = initialState,
    action: Actions
) {
    switch (action.type) {
        case SELECTION_ACTION_TYPES.SELECT_CURRENCY_PAIR: {
            const { currencyPair } = action.payload;

            return {
                ...state,
                currencyPair
            }
        }

        default:
            return state;
    }
}

export default selectionReducer;