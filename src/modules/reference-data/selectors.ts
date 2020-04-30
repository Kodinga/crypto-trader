import { createSelector } from 'reselect';
import { RootState } from 'modules/root';

const refDataSelector = (state: RootState) => state.refData;

export const getCurrencyPairs = createSelector(
    refDataSelector,
    refData => refData.currencyPairs
);
