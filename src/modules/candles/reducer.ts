import { createReducer } from 'modules/redux/utils';
import { TRANSPORT_ACTION_TYPES } from 'core/transport/actions';
import { isHeartbeat, isSubscriptionMessage, isUnsubscriptionMessage, isErrorMessage } from 'core/transport/utils';
import { ReceiveMessage } from 'core/transport/actions';
import { Actions } from './../root';
import { Candle } from './types/Candle';

type SymbolState = Candle[];

export interface CandlesState {
    [currencyPair: string]: SymbolState;
}

const initialState: CandlesState = {
}

function snapshotReducer(state: SymbolState, action: ReceiveMessage) {
    const [, candles] = action.payload;
    return candles.map(([timestamp, open, close, high, low, volume]: number[]) => ({
        timestamp, open, close, high, low, volume
    }));
}

function updateReducer(state: SymbolState = [], action: ReceiveMessage) {
    const [, candle] = action.payload;
    const [timestamp, open, close, high, low, volume] = candle;

    const updatedState = state.slice();
    updatedState.push({
        timestamp,
        open,
        close,
        high,
        low,
        volume
    });
    return updatedState;
}

const receiveMessageReducer = (state: CandlesState, action: ReceiveMessage) => {
    if (isHeartbeat(action) || isSubscriptionMessage(action) || isErrorMessage(action)) {
        return state;
    }

    const { channel, request } = action.meta || {};
    if (channel === 'candles') {
        const { key } = request;
        const [, , symbol] = key.split(':');
        const currencyPair = symbol.slice(1);

        if (isUnsubscriptionMessage(action)) {
            const updatedState = {
                ...state
            };
            delete updatedState[currencyPair];
            return updatedState;
        }

        const symbolReducer = Array.isArray(action.payload[1][0]) ? snapshotReducer : updateReducer;
        const result = symbolReducer(state[currencyPair], action);

        return {
            ...state,
            [currencyPair]: result
        };
    }

    return state;
}

export const candlesReducer = createReducer<CandlesState, Actions>({
    [TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE]: receiveMessageReducer
}, initialState);

export default candlesReducer;