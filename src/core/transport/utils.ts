import { WsMessageAction } from './actions';

export function isHeartbeat(action: WsMessageAction) {
    return Array.isArray(action.payload) && action.payload[1] === 'hb';
}