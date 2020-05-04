import { RootState } from 'modules/root';
import { getBook } from './selectors';

describe('BookSelectors', () => {

    describe('getBook()', () => {
        it('should handle empty book', () => {
            const currencyPair = 'BTCUSD';
            const state = {
                book: {
                }
            } as unknown as RootState;
            const result = getBook(state)(currencyPair);
            expect(result).toEqual([]);
        });
    
        it('should build book', () => {
            const currencyPair = 'BTCUSD';
            const state = {
                book: {
                    [currencyPair]: [
                        { id: 1, price: 10, amount: 2 }, // bid
                        { id: 2, price: 12, amount: 1 }, // bid
                        { id: 3, price: 13, amount: -1 }, // ask
                        { id: 4, price: 9, amount: 1 }, // bid
                        { id: 5, price: 12.5, amount: -2 } // ask
                    ]
                }
            } as unknown as RootState;
            const result = getBook(state)(currencyPair);
            expect(result).toEqual([
                {
                    depth: 0,
                    bid: {
                        id: 2,
                        price: 12,
                        amount: 1
                    },
                    ask: {
                        id: 5,
                        price: 12.5,
                        amount: -2
                    }
                },
                {
                    depth: 1,
                    bid: {
                        id: 1,
                        price: 10,
                        amount: 2
                    },
                    ask: {
                        id: 3,
                        price: 13,
                        amount: -1
                    }
                },
                {
                    depth: 2,
                    bid: {
                        id: 4,
                        price: 9,
                        amount: 1
                    },
                    ask: undefined
                }
            ]);
        });
    });
});