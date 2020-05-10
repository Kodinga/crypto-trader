import { createReducer } from 'modules/redux/utils';
import { Actions } from './../root';
import { TRANSPORT_ACTION_TYPES, ReceiveMessage } from 'core/transport/actions';
import { isHeartbeat } from 'core/transport/utils';
import { Ticker } from './types/Ticker';

export interface TickerState {
    [symbol: string]: Ticker;
}

const initialState: TickerState = {
}

const receiveMessageReducer = (state: TickerState, action: ReceiveMessage) => {
    if (isHeartbeat(action)) {
        return state;
    }

    const { channel, request } = action.meta || {};
    if (channel === 'ticker') {
        const { symbol } = request;                
        const currencyPair = symbol.slice(1);
        const [, [bid, bidSize, ask, askSize, dailyChange, dailyChangeRelative, lastPrice, volume, high, low]] = action.payload;

        return {
            ...state,
            [currencyPair]: {
                currencyPair,
                bid,
                bidSize,
                ask,
                askSize,
                dailyChange,
                dailyChangeRelative,
                lastPrice,
                volume,
                high,
                low
            }
        };
    }

    return state;
}

export const tickerReducer = createReducer<TickerState, Actions>({
    [TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE]: receiveMessageReducer
}, initialState);

export default tickerReducer;