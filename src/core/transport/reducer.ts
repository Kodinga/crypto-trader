import { on, reducer } from "ts-action";
import { isHeartbeat } from "core/transport/utils";
import { TransportActions } from "core/transport/actions";
import { ConnectionStatus } from "./types/ConnectionStatus";

export interface SubscriptionState {
  [key: number]: { channel: string; request: any; isStale?: boolean };
}

const initialState: SubscriptionState = {};

export const subscriptionsReducer = reducer(
  initialState,
  on(TransportActions.changeConnectionStatus, (state, action) => {
    if (action.payload === ConnectionStatus.Connected) {
      return initialState;
    }
    return state;
  }),
  on(TransportActions.subscribeToChannelAck, (state, action) => {
    const { request, channel, channelId } = action.payload;

    return {
      ...state,
      [channelId]: {
        channel,
        request,
      },
    };
  }),
  on(TransportActions.unsubscribeFromChannelAck, (state, action) => {
    const { channelId } = action.payload;

    const updatedState = {
      ...state,
    };
    delete updatedState[channelId];
    return updatedState;
  }),
  on(TransportActions.receiveMessage, (state, action) => {
    if (isHeartbeat(action)) {
      const [channelId] = action.payload;

      if (!Boolean(state[channelId].isStale)) {
        return state;
      }

      return {
        ...state,
        [channelId]: {
          ...state[channelId],
          isStale: false,
        },
      };
    }
    return state;
  }),
  on(TransportActions.staleSubscription, (state, action) => {
    const { channelId } = action.payload;

    return {
      ...state,
      [channelId]: {
        ...state[channelId],
        isStale: true,
      },
    };
  })
);

export default subscriptionsReducer;
