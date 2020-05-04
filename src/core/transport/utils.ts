import { ReceiveMessage } from './actions';

export function isHeartbeat(action: ReceiveMessage) {
    return Array.isArray(action.payload) && action.payload[1] === 'hb';
}