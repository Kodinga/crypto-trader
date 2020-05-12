import { createReducer } from "modules/redux/utils";
import { Actions } from "./../root";
import { UpdateLatency, PING_ACTION_TYPES } from "./actions";

interface PingState {
  latency?: number;
}

const initialState = {};

const updateLatencyReducer = (state: PingState, action: UpdateLatency) => {
  const { latency } = action.payload;

  return {
    ...state,
    latency,
  };
};

export const pingReducer = createReducer<PingState, Actions>(
  {
    [PING_ACTION_TYPES.UPDATE_LATENCY]: updateLatencyReducer,
  },
  initialState
);

export default pingReducer;
