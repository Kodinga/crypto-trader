import { TestScheduler } from 'rxjs/testing';
import { TradeActions, TradesSubscribeToSymbol } from './actions';
import { subscribeToTrades } from './epics';
import { WsActions } from 'core/transport/actions';
import { Dependencies } from 'modules/redux/store';
import { wrapHelpers } from 'testing/utils';

describe('TradesEpic', () => {
    describe('subscribeToTrades()', () => {
        it('should subscribe to symbol', async () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
    
            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    TradesSubscribeToSymbol,
                    any
                >(
                    helpers,
                    {}
                );
                const symbol = 'BTCUSD';
                const action$ = hotAction('-a', { a: TradeActions.subscribeToSymbol({ symbol }) });
                const state$ = hotState('-');
    
                const output$ = subscribeToTrades(action$, state$, {} as unknown as Dependencies);
    
                expectObservable(output$).toBe('-a', {
                    a: WsActions.subscribeToChannel({
                        channel: 'trades',
                        symbol: `t${symbol}`
                    })
                });
            });
        });
    });
});
