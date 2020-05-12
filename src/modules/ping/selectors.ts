import { createSelector } from "reselect";
import { RootState } from "modules/root";

const getPing = (state: RootState) => state.ping;

export const getLatency = createSelector(getPing, (ping) => ping.latency);
