import { TRANSPORT_ACTION_TYPES } from 'core/transport/actions';
import { isHeartbeat } from 'core/transport/utils';
import { ReceiveMessage } from './../../core/transport/actions';
import { Actions } from './../root';
import { Order } from './types/Order';

type SymbolState = Order[];

export interface BookState {
    [currencyPair: string]: SymbolState;
}

const initialState: BookState = {
}

function snapshotReducer(state: SymbolState, action: ReceiveMessage) {
    const [, orders] = action.payload;
    return orders.map(([id, price, amount]: any[]) => ({
        id,
        price,
        amount
    }));
}

function updateReducer(state: SymbolState = [], action: ReceiveMessage) {
    const [, order] = action.payload;
    const [id, price, amount] = order;
    const existingOrderIndex = state.findIndex(x => x.id === id);
    const newOrUpdatedOrder = {
        id,
        price,
        amount
    };

    if (price === 0 && existingOrderIndex >= 0) {
        // remove
        const updatedState = state.slice();
        updatedState.splice(existingOrderIndex, 1);
        return updatedState;
    } else if (existingOrderIndex >= 0) {
        // update
        const updatedState = state.slice();
        updatedState.splice(existingOrderIndex, 1, newOrUpdatedOrder);
        return updatedState;
    } else {
        // add
        return [
            ...state,
            newOrUpdatedOrder
        ];
    }
}

export function bookReducer(
    state = initialState,
    action: Actions
) {
    switch (action.type) {
        case TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE: {
            if (isHeartbeat(action)) {
                return state;
            }

            const { channel, request } = action.meta || {};

            if (channel === 'book') {
                const { symbol } = request;    
                const currencyPair = symbol.slice(1);            
                const symbolReducer = Array.isArray(action.payload[1][0]) ? snapshotReducer : updateReducer;
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

export default bookReducer;