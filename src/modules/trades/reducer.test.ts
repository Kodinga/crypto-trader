import { WsActions } from 'core/transport/actions';
import trades from './reducer';

describe('TradesReducer', () => {
    it('should handle snapshot', () => {
        const symbol = 'tBTCUSD';
        const channelId = 17470;
        const [id, timestamp, amount, price] = [1,1574694475039,0.005,7244.9];
        const data = [
            channelId,
            [
                [id, timestamp, amount, price]
            ]
        ];
        const meta = {
            channel: 'trades',
            request: {
                symbol
            }
        };
        const action = WsActions.wsMessage(data, meta);
        const result = trades(undefined, action);
        expect(result).toEqual({
            [symbol]: [
                {id, timestamp, amount, price}
            ]
        });
    });

    it('should handle insert', () => {   
        const symbol = 'tBTCUSD';
        const initialState = {
            [symbol]: [
                {id: 1, timestamp: 1574694475039, amount: 0.005, price: 7244.9}
            ]
        };
        
        const channelId = 17470;
        const [id, timestamp, amount, price] = [2,1574694478808,0.005,7245.3];
        const data = [
            channelId,
            'tu',
            [id, timestamp, amount, price]
        ];
        const meta = {
            channel: 'trades',
            request: {
                symbol
            }
        };
        const action = WsActions.wsMessage(data, meta);
        const result = trades(initialState, action);
        expect(result).toEqual({
            [symbol]: [
                {id: 1, timestamp: 1574694475039, amount: 0.005, price: 7244.9},
                {id, timestamp, amount, price}
            ]
        });
    });

    it('should handle upsert', () => {   
        const symbol = 'tBTCUSD';
        const initialState = {
            [symbol]: [
                {id: 1, timestamp: 1574694475039, amount: 0.005, price: 7244.9},
                {id: 2, timestamp: 1574694478808, amount: 0.005, price: 7245.9},
            ]
        };
        
        const channelId = 17470;
        const [id, timestamp, amount, price] = [2,1574694478808,0.01,7250.1];
        const data = [
            channelId,
            'tu',
            [id, timestamp, amount, price]
        ];
        const meta = {
            channel: 'trades',
            request: {
                symbol
            }
        };
        const action = WsActions.wsMessage(data, meta);
        const result = trades(initialState, action);
        expect(result).toEqual({
            [symbol]: [
                {id: 1, timestamp: 1574694475039, amount: 0.005, price: 7244.9},
                {id, timestamp, amount, price}
            ]
        });
    });

    it('should discard heartbeat', () => {   
        const symbol = 'tBTCUSD';
        const initialState = {
            [symbol]: [
                {id: 1, timestamp: 1574694475039, amount: 0.005, price: 7244.9},
                {id: 2, timestamp: 1574694478808, amount: 0.005, price: 7245.9},
            ]
        };
        
        const channelId = 17470;
        const data = [
            channelId,
            'hb'
        ];
        const meta = {
            channel: 'trades',
            request: {
                symbol
            }
        };
        const action = WsActions.wsMessage(data, meta);
        const result = trades(initialState, action);
        expect(result).toBe(initialState);
    });
});