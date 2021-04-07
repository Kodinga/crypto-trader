import { action } from "ts-action";
import { ActionUnion } from "../redux/utils";

export const PingActions = {
  updateLatency: action(
    "PING/UPDATE_LATENCY",
    (payload: { latency: number }) => ({ payload })
  ),
};

export type AllPingActions = ActionUnion<typeof PingActions>;
export type UpdateLatency = ReturnType<typeof PingActions.updateLatency>;
