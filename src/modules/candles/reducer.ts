import { WsMessage } from './../../core/transport/actions';
import { Actions } from './../root';
import { WS_ACTION_TYPES } from 'core/transport/actions';
import { isHeartbeat } from 'core/transport/utils';
import { Candle } from './types/Candle';

type SymbolState = Candle[];

export interface CandlesState {
    [currencyPair: string]: SymbolState;
}

const initialState: CandlesState = {
}

function snapshotReducer(state: SymbolState, action: WsMessage) {
    const [, candles] = action.payload;
    return candles.map(([timestamp, open, close, high, low, volume]: any[]) => ({
        timestamp,
        open,
        close,
        high, 
        low, 
        volume
    }));
} 

function updateReducer(state: SymbolState = [], action: WsMessage) {
    const [, , candle] = action.payload;
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

export function candlesReducer(
    state = initialState,
    action: Actions
) {
    switch (action.type) {
        case WS_ACTION_TYPES.WS_MESSAGE: {
            if (isHeartbeat(action)) {
                return state;
            }

            const { channel, request } = action.meta || {};
            if (channel === 'candles') {
                const { key } = request;  
                const [, , symbol] = key.split(':');  
                const currencyPair = symbol.slice(1);            
                const symbolReducer = Array.isArray(action.payload[1]) ? snapshotReducer : updateReducer;
                const result = symbolReducer(state[currencyPair], action);

                return {
                    ...state,
                    [currencyPair]: result
                };
            }

            return state;
        }

        default:
            return state;
    }
}
