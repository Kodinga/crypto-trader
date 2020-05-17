import { Actions } from "modules/root";
import { TRANSPORT_ACTION_TYPES } from "core/transport/actions";
import { createReducer } from "modules/redux/utils";
import {
  isHeartbeat,
  isSubscriptionMessage,
  isUnsubscriptionMessage,
  isErrorMessage,
} from "core/transport/utils";
import { ReceiveMessage } from "core/transport/actions";
import { APP_ACTION_TYPES } from "modules/app/actions";
import { Order } from "./types/Order";

type SymbolState = Order[];

export interface BookState {
  [currencyPair: string]: SymbolState;
}

const initialState: BookState = {};

function snapshotReducer(state: SymbolState, action: ReceiveMessage) {
  const [, orders] = action.payload;
  return orders.map(([id, price, amount]: any[]) => ({
    id,
    price,
    amount,
  }));
}

function updateReducer(state: SymbolState = [], action: ReceiveMessage) {
  const [, order] = action.payload;
  const [id, price, amount] = order;
  const existingOrderIndex = state.findIndex((x) => x.id === id);
  const newOrUpdatedOrder = {
    id,
    price,
    amount,
  };

  if (price === 0 && existingOrderIndex >= 0) {
    // remove
    const updatedState = state.slice();
    updatedState.splice(existingOrderIndex, 1);
    return updatedState;
  } else if (existingOrderIndex >= 0) {
    // update
    const updatedState = state.slice();
    updatedState.splice(existingOrderIndex, 1, newOrUpdatedOrder);
    return updatedState;
  } else {
    // add
    return [...state, newOrUpdatedOrder];
  }
}

const receiveMessageReducer = (state: BookState, action: ReceiveMessage) => {
  if (
    isHeartbeat(action) ||
    isSubscriptionMessage(action) ||
    isErrorMessage(action)
  ) {
    return state;
  }

  const { channel, request } = action.meta || {};

  if (channel === "book") {
    const { symbol } = request;
    const currencyPair = symbol.slice(1);

    if (isUnsubscriptionMessage(action)) {
      const updatedState = {
        ...state,
      };
      delete updatedState[currencyPair];
      return updatedState;
    }

    const symbolReducer = Array.isArray(action.payload[1][0])
      ? snapshotReducer
      : updateReducer;
    const result = symbolReducer(state[currencyPair], action);
    return {
      ...state,
      [currencyPair]: result,
    };
  }

  return state;
};

export const bookReducer = createReducer<BookState, Actions>(
  {
    [APP_ACTION_TYPES.BOOTSTRAP_APP]: () => initialState,
    [TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE]: receiveMessageReducer,
  },
  initialState
);

export default bookReducer;
