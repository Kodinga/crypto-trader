import { TestScheduler } from 'rxjs/testing';
import { TransportActions } from 'core/transport/actions';
import { Dependencies } from 'modules/redux/store';
import { wrapHelpers } from 'testing/utils';
import { TradesActions, SubscribeToTrades } from './actions';
import { subscribeToTrades } from './epics';

describe('TradesEpic', () => {
    describe('subscribeToTrades()', () => {
        it('should subscribe to symbol', async () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
    
            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    SubscribeToTrades,
                    any
                >(
                    helpers,
                    {}
                );
                const currencyPair = 'BTCUSD';
                const action$ = hotAction('-a', { a: TradesActions.subscribeToTrades({ symbol: currencyPair }) });
                const state$ = hotState('-');
    
                const output$ = subscribeToTrades(action$, state$, {} as unknown as Dependencies);
    
                expectObservable(output$).toBe('-a', {
                    a: TransportActions.subscribeToChannel({
                        channel: 'trades',
                        symbol: `t${currencyPair}`
                    })
                });
            });
        });
    });
});
