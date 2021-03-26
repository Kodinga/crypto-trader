import { reducer, on } from "ts-action";
import { RefDataActions } from "./actions";

interface RefDataState {
  currencyPairs: string[];
}

const initialState: RefDataState = {
  currencyPairs: [],
};

export const refDataReducer = reducer(
  initialState,
  on(RefDataActions.loadRefDataAck, (state, action) => {
    const { currencyPairs } = action.payload;

    return {
      ...state,
      currencyPairs,
    };
  })
);

export default refDataReducer;
