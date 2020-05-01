import { WsMessage } from './actions';

export function isHeartbeat(action: WsMessage) {
    return Array.isArray(action.payload) && action.payload[1] === 'hb';
}