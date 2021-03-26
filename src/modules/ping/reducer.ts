import { reducer, on } from "ts-action";
import { PingActions } from "./actions";

interface PingState {
  latency?: number;
}

const initialState: PingState = {
  latency: undefined,
};

export const pingReducer = reducer(
  initialState,
  on(PingActions.updateLatency, (state, action) => {
    const { latency } = action.payload;

    return {
      ...state,
      latency,
    };
  })
);

export default pingReducer;
