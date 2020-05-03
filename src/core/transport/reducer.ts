import { Actions } from 'modules/root';
import { WS_ACTION_TYPES } from 'core/transport/actions';

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
        case WS_ACTION_TYPES.WS_SUBSCRIBE_TO_CHANNEL_ACK: {
            const { request, channel, channelId } = action.payload;

            return {
                ...state,
                [channelId]: {
                    channel,
                    request
                }
            };
        }
        default:
            return state;
    }
}