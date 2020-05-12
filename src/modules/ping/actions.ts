import { createAction, ActionUnion } from "../redux/utils";

export enum PING_ACTION_TYPES {
  UPDATE_LATENCY = "PING/UPDATE_LATENCY",
}

interface UpdateLatencyActionPayload {
  latency: number;
}

export const PingActions = {
  updateLatency: createAction<
    PING_ACTION_TYPES.UPDATE_LATENCY,
    UpdateLatencyActionPayload
  >(PING_ACTION_TYPES.UPDATE_LATENCY),
};

export type PingActions = ActionUnion<typeof PingActions>;
export type UpdateLatency = ReturnType<typeof PingActions.updateLatency>;
