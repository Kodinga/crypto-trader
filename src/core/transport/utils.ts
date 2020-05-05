import { ReceiveMessage } from './actions';

export function isHeartbeat(action: ReceiveMessage) {
    return Array.isArray(action.payload) && action.payload[1] === 'hb';
}

export function isSubscriptionMessage(action: ReceiveMessage) {
    return action.payload.event === 'subscribed';
}

export function isUnsubscriptionMessage(action: ReceiveMessage) {
    return action.payload.event === 'unsubscribed';
}

export function isErrorMessage(action: ReceiveMessage) {
    return action.payload.event === 'error';
}
