import { Actions } from './../root';
import { TRANSPORT_ACTION_TYPES } from 'core/transport/actions';
import { isHeartbeat } from 'core/transport/utils';
import { Ticker } from './types/Ticker';

export interface TickerState {
    [symbol: string]: Ticker;
}

const initialState: TickerState = {
}

export function tickerReducer(
    state = initialState,
    action: Actions
) {
    switch (action.type) {
        case TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE: {
            if (isHeartbeat(action)) {
                return state;
            }

            const { channel, request } = action.meta || {};
            if (channel === 'ticker') {
                const { symbol } = request;                
                
                const [, [bid, bidSize, ask, askSize, dailyChange, dailyChangeRelative, lastPrice, volume, high, low]] = action.payload;

                return {
                    ...state,
                    [symbol.slice(1)]: {
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

        default:
            return state;
    }
}

export default tickerReducer;