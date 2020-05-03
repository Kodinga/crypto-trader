import { DummyConnectionProxy } from './DummyConnectionProxy';
import { TestScheduler } from 'rxjs/testing';
import { WsSend, WsMessage } from './actions';
import { handleWsSubscription, WS_SUBSCRIPTION_TIMEOUT_IN_MS, handleWsSend } from './epics';
import { WsActions, WsSubscribeToChannel } from 'core/transport/actions';
import { Dependencies } from 'modules/redux/store';
import { wrapHelpers } from 'testing/utils';
import { Connection } from './Connection';

jest.mock('./Connection');

beforeEach(() => {
    // @ts-ignore
    Connection.mockClear();
});

describe('TransportEpic', () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    describe('handleWsSend()', () => {
        it('should send a message on the wire', () => {
            testScheduler.run(async helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    WsSend,
                    any
                >(
                    helpers,
                    {}
                );
                const connection = new Connection(new DummyConnectionProxy());
                const message = {};
                const action$ = hotAction('-a|', { a: WsActions.wsSend(message) });
                const state$ = hotState('--|');
                const dependencies = {
                    connection
                }
                const output$ = handleWsSend(action$, state$, dependencies);
                await output$.toPromise();

                expectObservable(output$).toBe('--|');
                expect(connection.send).toHaveBeenCalledWith(JSON.stringify(message));
            });
        });
    });

    describe('handleWsSubscription()', () => {
        it('should handle successful subscription', async () => {
            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    WsSubscribeToChannel | WsMessage,
                    any
                >(
                    helpers,
                    {}
                );
                const channel = 'trades';
                const symbol = 'tBTCUSD';
                const channelId = 1;
                
                const action$ = hotAction('-a-b', {
                    a: WsActions.subscribeToChannel({
                        channel,
                        symbol
                    }),
                    b: WsActions.wsMessage({
                        event: 'subscribed',
                        channel,
                        chanId: channelId
                    }, undefined)
                });
                const state$ = hotState('-');
                const output$ = handleWsSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe('-a-b', {
                    a: WsActions.wsSend({
                        event: 'subscribe',
                        channel,
                        symbol
                    }),
                    b: WsActions.subscribeToChannelAck({
                        channel,
                        channelId,
                        request: {
                            channel,
                            symbol
                        }
                    })
                });
            });
        });

        it('should queue up subscriptions', async () => {
            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    WsSubscribeToChannel | WsMessage,
                    any
                >(
                    helpers,
                    {}
                );
                const channel = 'trades';
                const symbolRequest1 = 'tBTCUSD';
                const symbolRequest2 = 'tBTC';
                const channel1 = 1;
                const channel2 = 2;
                
                const action$ = hotAction('-ab-c--- 100ms d', {
                    a: WsActions.subscribeToChannel({
                        channel,
                        symbol: symbolRequest1
                    }),
                    b: WsActions.subscribeToChannel({
                        channel,
                        symbol: symbolRequest2
                    }),
                    c: WsActions.wsMessage({
                        event: 'subscribed',
                        channel,
                        chanId: channel1
                    }, undefined),
                    d: WsActions.wsMessage({
                        event: 'subscribed',
                        channel,
                        chanId: channel2
                    }, undefined)
                });
                const state$ = hotState('-');
                const output$ = handleWsSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe('-a--(bc) 100ms d', {
                    a: WsActions.wsSend({
                        event: 'subscribe',
                        channel,
                        symbol: symbolRequest1
                    }),
                    b: WsActions.subscribeToChannelAck({
                        channel,
                        channelId: channel1,
                        request: {
                            channel,
                            symbol: symbolRequest1
                        }
                    }),
                    c: WsActions.wsSend({
                        event: 'subscribe',
                        channel,
                        symbol: symbolRequest2
                    }),
                    d: WsActions.subscribeToChannelAck({
                        channel,
                        channelId: channel2,
                        request: {
                            channel,
                            symbol: symbolRequest2
                        }
                    })
                });
            });
        });

        it('should handle an error', async () => {
            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    WsSubscribeToChannel | WsMessage,
                    any
                >(
                    helpers,
                    {}
                );
                const errorMessage = 'Error';

                const action$ = hotAction('-a-b', {
                    a: WsActions.subscribeToChannel({
                        channel: 'trades',
                        symbol: 'tBTCUSD'
                    }),
                    b: WsActions.wsMessage({
                        event: 'error',
                        msg: errorMessage
                    }, undefined)
                });
                const state$ = hotState('-');
                const output$ = handleWsSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe('-a-b', {
                    a: WsActions.wsSend({
                        event: 'subscribe',
                        channel: 'trades',
                        symbol: 'tBTCUSD'
                    }),
                    b: WsActions.subscribeToChannelNack({
                        error: errorMessage
                    })
                });
            });
        });

        it('should handle timeout', () => {
            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    WsSubscribeToChannel | WsMessage,
                    any
                >(
                    helpers,
                    {}
                );

                const action$ = hotAction(`-a ${WS_SUBSCRIPTION_TIMEOUT_IN_MS}ms `, {
                    a: WsActions.subscribeToChannel({
                        channel: 'trades',
                        symbol: 'tBTCUSD'
                    })
                });
                const state$ = hotState('-');
                const output$ = handleWsSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe(`-a ${WS_SUBSCRIPTION_TIMEOUT_IN_MS - 1}ms (b|)`, {
                    a: WsActions.wsSend({
                        event: 'subscribe',
                        channel: 'trades',
                        symbol: 'tBTCUSD'
                    }),
                    b: WsActions.subscribeToChannelNack({
                        error: 'Timeout'
                    })
                });
            });
        });
    });
});
