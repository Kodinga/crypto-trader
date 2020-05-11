import { Actions } from "modules/root";
import { REF_DATA_ACTION_TYPES, LoadRefDataAck } from "./actions";
import { createReducer } from "modules/redux/utils";

interface RefDataState {
  currencyPairs: string[];
}

const initialState: RefDataState = {
  currencyPairs: [],
};

const loadRefDataReducer = (state: RefDataState, action: LoadRefDataAck) => {
  const { currencyPairs } = action.payload;

  return {
    ...state,
    currencyPairs,
  };
};

export const refDataReducer = createReducer<RefDataState, Actions>(
  {
    [REF_DATA_ACTION_TYPES.LOAD_REF_DATA_ACK]: loadRefDataReducer,
  },
  initialState
);

export default refDataReducer;
