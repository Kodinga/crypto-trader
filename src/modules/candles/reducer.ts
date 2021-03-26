import { reducer, on } from "ts-action";
import { TransportActions } from "core/transport/actions";
import {
  isHeartbeat,
  isSubscriptionMessage,
  isUnsubscriptionMessage,
  isErrorMessage,
} from "core/transport/utils";
import { ReceiveMessage } from "core/transport/actions";
import { ConnectionStatus } from "core/transport/types/ConnectionStatus";
import { getLookupKey } from "./utils";
import { Candle } from "./types/Candle";

const MAX_CANDLES = 100;

type SymbolState = Candle[];

export interface CandlesState {
  [currencyPair: string]: SymbolState;
}

const initialState: CandlesState = {};

function snapshotReducer(state: SymbolState, action: ReceiveMessage) {
  const [, candles] = action.payload;
  return candles
    .map(([timestamp, open, close, high, low, volume]: number[]) => ({
      timestamp,
      open,
      close,
      high,
      low,
      volume,
    }))
    .sort((a: Candle, b: Candle) => b.timestamp - a.timestamp);
}

function updateReducer(state: SymbolState = [], action: ReceiveMessage) {
  const [, candle] = action.payload;
  const [timestamp, open, close, high, low, volume] = candle;
  const candleIndex = state.findIndex((c) => c.timestamp === timestamp);
  const newOrUpdatedCandle = {
    timestamp,
    open,
    close,
    high,
    low,
    volume,
  };

  if (candleIndex >= 0) {
    const updatedState = state.slice();
    updatedState.splice(candleIndex, 1, newOrUpdatedCandle);
    return updatedState;
  }
  return [newOrUpdatedCandle, ...state];
}

export const candlesReducer = reducer(
  initialState,
  on(TransportActions.changeConnectionStatus, (state, action) => {
    if (action.payload === ConnectionStatus.Connected) {
      return initialState;
    }
    return state;
  }),
  on(TransportActions.receiveMessage, (state, action) => {
    if (
      isHeartbeat(action) ||
      isSubscriptionMessage(action) ||
      isErrorMessage(action)
    ) {
      return state;
    }

    const { channel, request } = action.meta || {};
    if (channel === "candles") {
      const { key } = request;
      const [, timeframe, symbol] = key.split(":");
      const currencyPair = symbol.slice(1);
      const lookupKey = getLookupKey(currencyPair, timeframe);

      if (isUnsubscriptionMessage(action)) {
        const updatedState = {
          ...state,
        };
        delete updatedState[lookupKey];
        return updatedState;
      }

      const symbolReducer = Array.isArray(action.payload[1][0])
        ? snapshotReducer
        : updateReducer;
      const result = symbolReducer(state[lookupKey], action);

      return {
        ...state,
        [lookupKey]: result.slice(0, MAX_CANDLES), // restrict number of candles so we don't eventully fill up the memory
      };
    }

    return state;
  })
);

export default candlesReducer;
