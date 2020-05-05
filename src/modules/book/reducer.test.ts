import { TransportActions } from 'core/transport/actions';
import book from './reducer';

describe('BookReducer', () => {
    it('should handle snapshot', () => {
        const currencyPair = 'BTCUSD';
        const channelId = 17470;
        const [id, price, amount] = [1, 7294.7, 1.5];
        const data = [
            channelId,
            [
                [id, price, amount]
            ]
        ];
        const meta = {
            channel: 'book',
            request: {
                symbol: `t${currencyPair}`
            }
        };
        const action = TransportActions.receiveMessage(data, meta);
        const result = book(undefined, action);
        expect(result).toEqual({
            [currencyPair]: [
                {id, price, amount}
            ]
        });
    });

    it('should handle insert', () => {
        const currencyPair = 'BTCUSD';
        const channelId = 17470;
        const [id, price, amount] = [2, 7293.2, -1.2];
        const initialState = {
            [currencyPair]: [
                {id: 1, price: 7294.7, amount: 1.5}
            ]
        };
        const data = [
            channelId,
            [id, price, amount]
        ];
        const meta = {
            channel: 'book',
            request: {
                symbol: `t${currencyPair}`
            }
        };
        const action = TransportActions.receiveMessage(data, meta);
        const result = book(initialState, action);
        expect(result).toEqual({
            [currencyPair]: [
                {id: 1, price: 7294.7, amount: 1.5},
                {id, price, amount}
            ]
        });
    });

    it('should handle delete', () => {
        const currencyPair = 'BTCUSD';
        const channelId = 17470;
        const [id, price, amount] = [2, 0, -1.2]; // price = 0 => remove
        const initialState = {
            [currencyPair]: [
                {id: 1, price: 7294.7, amount: 1.5},
                {id: 2, price: 7293.2, amount: -1.2}
            ]
        };
        const data = [
            channelId,
            [id, price, amount]
        ];
        const meta = {
            channel: 'book',
            request: {
                symbol: `t${currencyPair}`
            }
        };
        const action = TransportActions.receiveMessage(data, meta);
        const result = book(initialState, action);
        expect(result).toEqual({
            [currencyPair]: [
                {id: 1, price: 7294.7, amount: 1.5}
            ]
        });
    });

    it('should clear state on unsubscription', () => {   
        const currencyPair = 'BTCUSD';
        const otherCurrencyPair = 'BTCEUR';
        const initialState = {
            [currencyPair]: [
                {id: 1, price: 7294.7, amount: 1.5}
            ],
            [otherCurrencyPair]: []
        };
        
        const channelId = 17470;
        const data = {
            event: 'unsubscribed',
            chanId: channelId,
        };
        const meta = {
            channel: 'book',
            request: {
                symbol: `t${currencyPair}`
            }
        };
        const action = TransportActions.receiveMessage(data, meta);
        const result = book(initialState, action);
        expect(result).toEqual({
            [otherCurrencyPair]: []
        });
    });
});