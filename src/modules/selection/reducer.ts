import { reducer, on } from "ts-action";
import { SelectionActions } from "./actions";

interface SelectionState {
  currencyPair?: string;
}

const initialState: SelectionState = {};

export const selectionReducer = reducer(
  initialState,
  on(SelectionActions.selectCurrencyPair, (state, action) => {
    const { currencyPair } = action.payload;

    return {
      ...state,
      currencyPair,
    };
  })
);

export default selectionReducer;
