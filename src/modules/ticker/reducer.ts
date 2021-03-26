import { reducer, on } from "ts-action";
import { TransportActions } from "core/transport/actions";
import { isHeartbeat } from "core/transport/utils";
import { ConnectionStatus } from "core/transport/types/ConnectionStatus";
import { Ticker } from "./types/Ticker";

export interface TickerState {
  [symbol: string]: Ticker;
}

const initialState: TickerState = {};

export const tickerReducer = reducer(
  initialState,
  on(TransportActions.changeConnectionStatus, (state, action) => {
    if (action.payload === ConnectionStatus.Connected) {
      return initialState;
    }
    return state;
  }),
  on(TransportActions.receiveMessage, (state, action) => {
    if (isHeartbeat(action)) {
      return state;
    }

    const { channel, request } = action.meta || {};
    if (channel === "ticker") {
      const { symbol } = request;
      const currencyPair = symbol.slice(1);
      const [
        ,
        [
          bid,
          bidSize,
          ask,
          askSize,
          dailyChange,
          dailyChangeRelative,
          lastPrice,
          volume,
          high,
          low,
        ],
      ] = action.payload;

      return {
        ...state,
        [currencyPair]: {
          currencyPair,
          bid,
          bidSize,
          ask,
          askSize,
          dailyChange,
          dailyChangeRelative,
          lastPrice,
          volume,
          high,
          low,
        },
      };
    }

    return state;
  })
);

export default tickerReducer;
