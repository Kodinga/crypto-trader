import { TestScheduler } from 'rxjs/testing';
import { TransportActions } from 'core/transport/actions';
import { Dependencies } from 'modules/redux/store';
import { wrapHelpers } from 'testing/utils';
import { TickerActions, SubscribeToTicker } from './actions';
import { subscribeToTicker } from './epics';

describe('TickerEpic', () => {
    describe('subscribeToTicker()', () => {
        it('should subscribe to symbol', async () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });

            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    SubscribeToTicker,
                    any
                >(
                    helpers,
                    {}
                );
                const currencyPair = 'BTCUSD';
                const action$ = hotAction('-a', { a: TickerActions.subscribeToTicker({ symbol: currencyPair }) });
                const state$ = hotState('-');

                const output$ = subscribeToTicker(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe('-a', {
                    a: TransportActions.subscribeToChannel({
                        channel: 'ticker',
                        symbol: `t${currencyPair}`
                    })
                });
            });
        });
    });
});
