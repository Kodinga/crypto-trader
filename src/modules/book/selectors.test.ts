import { RootState } from 'modules/root';
import { getBook, getDepth } from './selectors';

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
                    bid: {
                        id: 2,
                        price: 12,
                        amount: 1
                    },
                    ask: {
                        id: 5,
                        price: 12.5,
                        amount: -2
                    },
                    maxDepth: 7,
                    bidDepth: 1,
                    askDepth: 2
                },
                {
                    bid: {
                        id: 1,
                        price: 10,
                        amount: 2
                    },
                    ask: {
                        id: 3,
                        price: 13,
                        amount: -1
                    },
                    maxDepth: 7,
                    bidDepth: 3,
                    askDepth: 3
                },
                {
                    bid: {
                        id: 4,
                        price: 9,
                        amount: 1
                    },
                    ask: undefined,
                    maxDepth: 7,
                    bidDepth: 4,
                    askDepth: undefined
                }
            ]);
        });
    });

    describe('getDepth()', () => {
        it('should compute market depth', () => {
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
            const result = getDepth(state)(currencyPair);
            expect(result).toEqual({
                bids: [{
                    price: 9,
                    depth: 4
                }, {
                    price: 10,
                    depth: 3
                }, {
                    price: 12,
                    depth: 1
                }],
                asks: [{
                    price: 12.5,
                    depth: 2
                }, {
                    price: 13,
                    depth: 3
                }]
            });
        })
    });
});