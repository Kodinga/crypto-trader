import { createSelector } from 'reselect';
import { memoize } from 'lodash';
import { RootState } from 'modules/root';

const candlesSelector = (state: RootState) => state.candles;

export const getCandles = createSelector(
    candlesSelector,
    candles => memoize(
        (symbol: string) => candles[symbol]
    )
)
