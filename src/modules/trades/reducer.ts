import { reducer, on } from "ts-action";
import { TransportActions } from "core/transport/actions";
import {
  isHeartbeat,
  isSubscriptionMessage,
  isUnsubscriptionMessage,
  isErrorMessage,
} from "core/transport/utils";
import { ConnectionStatus } from "core/transport/types/ConnectionStatus";
import { ReceiveMessage } from "core/transport/actions";
import { Trade } from "./types/Trade";

type SymbolState = Trade[];

export const MAX_TRADES = 100;

export interface TradesState {
  [currencyPair: string]: SymbolState;
}

const initialState: TradesState = {};

function snapshotReducer(state: SymbolState, action: ReceiveMessage) {
  const [, trades] = action.payload;
  return trades
    .sort((a: number[], b: number[]) => b[1] - a[1])
    .map(([id, timestamp, amount, price]: number[]) => ({
      id,
      timestamp,
      amount,
      price,
    }));
}

function updateReducer(state: SymbolState = [], action: ReceiveMessage) {
  const [, , trade] = action.payload;
  const [id, timestamp, amount, price] = trade;
  const existingTradeIndex = state.findIndex((x) => x.id === id);
  const newOrUpdatedTrade = {
    id,
    timestamp,
    amount,
    price,
  };

  if (existingTradeIndex >= 0) {
    const updatedState = state.slice();
    updatedState.splice(existingTradeIndex, 1, newOrUpdatedTrade);
    return updatedState;
  } else {
    return [newOrUpdatedTrade, ...state];
  }
}

export const tradesReducer = reducer(
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
    if (channel === "trades") {
      const { symbol } = request;
      const currencyPair = symbol.slice(1);
      if (isUnsubscriptionMessage(action)) {
        const updatedState = {
          ...state,
        };
        delete updatedState[currencyPair];
        return updatedState;
      }

      const symbolReducer = Array.isArray(action.payload[1])
        ? snapshotReducer
        : updateReducer;
      const result = symbolReducer(state[currencyPair], action);

      return {
        ...state,
        [currencyPair]: result.slice(0, MAX_TRADES), // only keep the top x trades, so we don't eventually fill up the memory
      };
    }

    return state;
  })
);

export default tradesReducer;
