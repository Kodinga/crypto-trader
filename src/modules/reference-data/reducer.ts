import { REF_DATA_ACTION_TYPES } from './actions';
import { Actions } from 'modules/root';

interface RefDataState {
    currencyPairs: string[];
}

const initialState: RefDataState = {
    currencyPairs: []
}

export function refDataReducer(
    state = initialState,
    action: Actions
) {
    switch (action.type) {
        case REF_DATA_ACTION_TYPES.REF_DATA_LOAD_ACK: {
            const { currencyPairs } = action.payload;

            return {
                ...state,
                currencyPairs
            }
        }

        default:
            return state;
    }
}

export default refDataReducer;