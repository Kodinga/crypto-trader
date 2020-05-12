import { isHeartbeat } from 'core/transport/utils';
import { createReducer } from "modules/redux/utils";
import { Actions } from "modules/root";
import { TRANSPORT_ACTION_TYPES, ReceiveMessage, StaleSubscription } from "core/transport/actions";
import { SubscribeToChannelAck, UnsubscribeFromChannelAck } from "./actions";

export interface SubscriptionState {
  [key: number]: { channel: string; request: any, isStale?: boolean };
}

const initialState: SubscriptionState = {};

const subscribeToChannelAckReducer = (
  state: SubscriptionState,
  action: SubscribeToChannelAck
) => {
  const { request, channel, channelId } = action.payload;

  return {
    ...state,
    [channelId]: {
      channel,
      request,
    },
  };
};

const unsubscribeFromChannelAckReducer = (
  state: SubscriptionState,
  action: UnsubscribeFromChannelAck
) => {
  const { channelId } = action.payload;

  const updatedState = {
    ...state,
  };
  delete updatedState[channelId];
  return updatedState;
};

const receiveMessageReducer = (state: SubscriptionState, action: ReceiveMessage) => {
  if (isHeartbeat(action)) {
    const [channelId] = action.payload;

    return {
      ...state,
      [channelId]: {
        ...state[channelId],
        isStale: false
      }
    }
  }
  return state;
}

const staleSubscriptionReducer = (state: SubscriptionState, action: StaleSubscription) => {
  const { channelId } = action.payload;

  return {
    ...state,
    [channelId]: {
      ...state[channelId],
      isStale: true
    }
  }
}

export const subscriptionsReducer = createReducer<SubscriptionState, Actions>(
  {
    [TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_ACK]: subscribeToChannelAckReducer,
    [TRANSPORT_ACTION_TYPES.UNSUBSCRIBE_FROM_CHANNEL_ACK]: unsubscribeFromChannelAckReducer,
    [TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE]: receiveMessageReducer,
    [TRANSPORT_ACTION_TYPES.STALE_SUBSCRIPTION]: staleSubscriptionReducer
  },
  initialState
);

export default subscriptionsReducer;
