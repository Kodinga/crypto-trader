import { TestScheduler } from 'rxjs/testing';
import { Dependencies } from 'modules/redux/store';
import { wrapHelpers } from 'testing/utils';
import { TransportActions, SubscribeToChannel, UnsubscribeFromChannel } from 'core/transport/actions';
import { DummyConnectionProxy } from './DummyConnectionProxy';
import { SendMessage, ReceiveMessage } from './actions';
import { handleSubscription, WS_SUBSCRIPTION_TIMEOUT_IN_MS, handleSendMessage } from './epics';
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

    describe('handleSendMessage()', () => {
        it('should send a message on the wire', () => {
            testScheduler.run(async helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    SendMessage,
                    any
                >(
                    helpers,
                    {}
                );
                const connection = new Connection(new DummyConnectionProxy());
                const message = {};
                const action$ = hotAction('-a|', { a: TransportActions.sendMessage(message) });
                const state$ = hotState('--|');
                const dependencies = {
                    connection
                }
                const output$ = handleSendMessage(action$, state$, dependencies);
                await output$.toPromise();

                expectObservable(output$).toBe('--|');
                expect(connection.send).toHaveBeenCalledWith(JSON.stringify(message));
            });
        });
    });

    describe('handleSubscription()', () => {
        it('should handle successful subscription', async () => {
            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    SubscribeToChannel | ReceiveMessage,
                    any
                >(
                    helpers,
                    {}
                );
                const channel = 'trades';
                const symbol = 'tBTCUSD';
                const channelId = 1;
                
                const action$ = hotAction('-a-b', {
                    a: TransportActions.subscribeToChannel({
                        channel,
                        symbol
                    }),
                    b: TransportActions.receiveMessage({
                        event: 'subscribed',
                        channel,
                        chanId: channelId
                    }, undefined)
                });
                const state$ = hotState('-');
                const output$ = handleSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe('-a-b', {
                    a: TransportActions.sendMessage({
                        event: 'subscribe',
                        channel,
                        symbol
                    }),
                    b: TransportActions.subscribeToChannelAck({
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
                    SubscribeToChannel | ReceiveMessage,
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
                    a: TransportActions.subscribeToChannel({
                        channel,
                        symbol: symbolRequest1
                    }),
                    b: TransportActions.subscribeToChannel({
                        channel,
                        symbol: symbolRequest2
                    }),
                    c: TransportActions.receiveMessage({
                        event: 'subscribed',
                        channel,
                        chanId: channel1
                    }, undefined),
                    d: TransportActions.receiveMessage({
                        event: 'subscribed',
                        channel,
                        chanId: channel2
                    }, undefined)
                });
                const state$ = hotState('-');
                const output$ = handleSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe('-a--(bc) 100ms d', {
                    a: TransportActions.sendMessage({
                        event: 'subscribe',
                        channel,
                        symbol: symbolRequest1
                    }),
                    b: TransportActions.subscribeToChannelAck({
                        channel,
                        channelId: channel1,
                        request: {
                            channel,
                            symbol: symbolRequest1
                        }
                    }),
                    c: TransportActions.sendMessage({
                        event: 'subscribe',
                        channel,
                        symbol: symbolRequest2
                    }),
                    d: TransportActions.subscribeToChannelAck({
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
                    SubscribeToChannel | ReceiveMessage,
                    any
                >(
                    helpers,
                    {}
                );
                const errorMessage = 'Error';

                const action$ = hotAction('-a-b', {
                    a: TransportActions.subscribeToChannel({
                        channel: 'trades',
                        symbol: 'tBTCUSD'
                    }),
                    b: TransportActions.receiveMessage({
                        event: 'error',
                        msg: errorMessage
                    }, undefined)
                });
                const state$ = hotState('-');
                const output$ = handleSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe('-a-b', {
                    a: TransportActions.sendMessage({
                        event: 'subscribe',
                        channel: 'trades',
                        symbol: 'tBTCUSD'
                    }),
                    b: TransportActions.subscribeToChannelNack({
                        error: errorMessage
                    })
                });
            });
        });

        it('should handle subscription timing out', () => {
            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    SubscribeToChannel | ReceiveMessage,
                    any
                >(
                    helpers,
                    {}
                );

                const action$ = hotAction(`-a ${WS_SUBSCRIPTION_TIMEOUT_IN_MS}ms `, {
                    a: TransportActions.subscribeToChannel({
                        channel: 'trades',
                        symbol: 'tBTCUSD'
                    })
                });
                const state$ = hotState('-');
                const output$ = handleSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe(`-a ${WS_SUBSCRIPTION_TIMEOUT_IN_MS - 1}ms b`, {
                    a: TransportActions.sendMessage({
                        event: 'subscribe',
                        channel: 'trades',
                        symbol: 'tBTCUSD'
                    }),
                    b: TransportActions.subscribeToChannelNack({
                        error: 'Timeout'
                    })
                });
            });
        });

        it('should handle successful unsubscription', async () => {
            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    UnsubscribeFromChannel | ReceiveMessage,
                    any
                >(
                    helpers,
                    {}
                );
               
                const channelId = 1;
                
                const action$ = hotAction('-a-b', {
                    a: TransportActions.unsubscribeFromChannel({
                        channelId
                    }),
                    b: TransportActions.receiveMessage({
                        event: 'unsubscribed',
                        chanId: channelId
                    }, undefined)
                });
                const state$ = hotState('-');
                const output$ = handleSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe('-a-b', {
                    a: TransportActions.sendMessage({
                        event: 'unsubscribe',
                        chanId: channelId
                    }),
                    b: TransportActions.unsubscribeFromChannelAck({
                        channelId
                    })
                });
            });
        });

        it('should handle unsubscription timing out', () => {
            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    UnsubscribeFromChannel | ReceiveMessage,
                    any
                >(
                    helpers,
                    {}
                );
                const channelId = 12;
                const action$ = hotAction(`-a ${WS_SUBSCRIPTION_TIMEOUT_IN_MS}ms `, {
                    a: TransportActions.unsubscribeFromChannel({
                        channelId
                    })
                });
                const state$ = hotState('-');
                const output$ = handleSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe(`-a ${WS_SUBSCRIPTION_TIMEOUT_IN_MS - 1}ms b`, {
                    a: TransportActions.sendMessage({
                        event: 'unsubscribe',
                        chanId: channelId
                    }),
                    b: TransportActions.unsubscribeFromChannelNack()
                });
            });
        });
    });
});
