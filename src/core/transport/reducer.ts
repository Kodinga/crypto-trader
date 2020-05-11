import { createReducer } from "modules/redux/utils";
import { Actions } from "modules/root";
import { TRANSPORT_ACTION_TYPES } from "core/transport/actions";
import { SubscribeToChannelAck, UnsubscribeFromChannelAck } from "./actions";

export interface SubscriptionState {
  [key: number]: { channel: string; request: any };
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

export const subscriptionsReducer = createReducer<SubscriptionState, Actions>(
  {
    [TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_ACK]: subscribeToChannelAckReducer,
    [TRANSPORT_ACTION_TYPES.UNSUBSCRIBE_FROM_CHANNEL_ACK]: unsubscribeFromChannelAckReducer,
  },
  initialState
);

export default subscriptionsReducer;
