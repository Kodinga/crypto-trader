import { Actions } from 'modules/root';
import { TRANSPORT_ACTION_TYPES } from 'core/transport/actions';

export interface SubscriptionState {
    [key: number]: { channel: string, request: any };
}

const initialState: SubscriptionState = {
};

export function subscriptionsReducer(
    state = initialState,
    action: Actions
) {
    switch (action.type) {
        case TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_ACK: {
            const { request, channel, channelId } = action.payload;

            return {
                ...state,
                [channelId]: {
                    channel,
                    request
                }
            };
        }
        case TRANSPORT_ACTION_TYPES.UNSUBSCRIBE_FROM_CHANNEL_ACK: {
            const { channelId } = action.payload;

            const updatedState = {
                ...state
            };
            delete updatedState[channelId];
            return updatedState;
        }
        default:
            return state;
    }
}