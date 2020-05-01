import { WsMessageAction } from './../../core/transport/actions';
import { Actions } from './../root';
import { WS_ACTION_TYPES } from 'core/transport/actions';
import { isHeartbeat } from 'core/transport/utils';
import { Trade } from './types/Trade';

type SymbolState = Trade[];

export interface TradesState {
    [currencyPair: string]: SymbolState;
}

const initialState: TradesState = {
}

function snapshotReducer(state: SymbolState, action: WsMessageAction) {
    const [, trades] = action.payload;
    return trades.map(([id, timestamp, amount, price]: any[]) => ({
        id,
        timestamp,
        amount,
        price
    }));
}

function updateReducer(state: SymbolState = [], action: WsMessageAction) {
    const [, , trade] = action.payload;
    const [id, timestamp, amount, price] = trade;
    const existingTradeIndex = state.findIndex(x => x.id === id);
    const newOrUpdatedTrade = {
        id,
        timestamp,
        amount,
        price
    };

    if (existingTradeIndex >= 0) {
        const updatedState = state.slice();
        updatedState.splice(existingTradeIndex, 1, newOrUpdatedTrade);
        return updatedState;
    } else {
        return [
            ...state,
            newOrUpdatedTrade
        ];
    }
}

export function tradesReducer(
    state = initialState,
    action: Actions
) {
    switch (action.type) {
        case WS_ACTION_TYPES.WS_MESSAGE: {
            if (isHeartbeat(action)) {
                return state;
            }

            const { channel, request } = action.meta || {};
            if (channel === 'trades') {
                const { symbol } = request;    
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

export default tradesReducer;