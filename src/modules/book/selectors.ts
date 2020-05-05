import { createSelector } from 'reselect';
import { memoize, range, uniq } from 'lodash';
import { RootState } from 'modules/root';
import { Order } from './types/Order';

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

        const maxDepth = Math.max(bids.length, asks.length);

        return range(maxDepth)
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

const getPricePoints = (orders: Order[]) => uniq(orders.map(order => order.price)).sort((a, b) => a - b);

const computeDepth = (orders: Order[]) => {
    return (pricePoints: number[], orderFilter: (order: Order, pricePoint: number) => boolean) => {
        return pricePoints.map(price => {
            const depth = orders.filter(order => orderFilter(order, price)).reduce((acc, order) => {
                return acc += Math.abs(order.amount);
            }, 0);
            return {
                price,
                depth
            };
        });
    }
}

export const getDepth = createSelector(
    bookSelector,
    book => memoize((symbol: string) => {
        const rawBook = book[symbol] || [];

        const bids = rawBook
            .filter(order => order.amount > 0);

        const asks = rawBook
            .filter(order => order.amount < 0);

        const bidPrices = getPricePoints(bids);
        const askPrices = getPricePoints(asks);

        const bidDepth = computeDepth(bids)(bidPrices, (order, pricePoint) => order.price >= pricePoint);
        const askDepth = computeDepth(asks)(askPrices, (order, pricePoint) => order.price <= pricePoint);

        return {
            bids: bidDepth,
            asks: askDepth
        };
    })
)