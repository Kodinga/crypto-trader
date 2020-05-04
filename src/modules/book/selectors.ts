import { createSelector } from 'reselect';
import { memoize, range } from 'lodash';
import { RootState } from 'modules/root';

const bookSelector = (state: RootState) => state.book;

export const getRawBook = createSelector(
    bookSelector,
    book => memoize(
        (symbol: string) => book[symbol]
    )
)

export const getBook = createSelector(
    bookSelector,
    book => memoize((symbol: string) => {
        const rawBook = book[symbol] || [];

        const bids = rawBook
            .filter(order => order.amount > 0)
            .sort((a, b) => b.price - a.price);
        const asks = rawBook
            .filter(order => order.amount < 0)
            .sort((a, b) => a.price - b.price);

        const depth = Math.max(bids.length, asks.length);

        return range(depth)
            .map(depth => {
                const bid = bids[depth];
                const ask = asks[depth];

                return {
                    bid,
                    ask,
                    depth
                };
            });
    })
)