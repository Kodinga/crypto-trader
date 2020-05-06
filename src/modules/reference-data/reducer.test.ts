import { RefDataActions } from 'modules/reference-data/actions';
import refData from './reducer';

describe('RefDataReducer', () => {
    it('should set ref data', () => {
        const currencyPairs = ['BTCUSD'];
        const action = RefDataActions.loadRefDataAck({currencyPairs});
        const result = refData(undefined, action);
        expect(result).toEqual({
            currencyPairs
        });
    });
});