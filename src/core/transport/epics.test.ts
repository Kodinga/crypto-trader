import { DummyConnectionProxy } from './DummyConnectionProxy';
import { TestScheduler } from 'rxjs/testing';
import { WsSend, WsMessage } from './actions';
import { handleWsSubscription, WS_SUBSCRIPTION_TIMEOUT_IN_MS, handleWsSend } from './epics';
import { WsActions } from 'core/transport/actions';
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
                    WsSend | WsMessage,
                    any
                >(
                    helpers,
                    {}
                );
                const channel = 'topic';
                const channelId = 1;
                const subscribeRequest = {
                    event: 'subscribe',
                    channel
                };

                const action$ = hotAction('-a-b', {
                    a: WsActions.wsSend(subscribeRequest),
                    b: WsActions.wsMessage({
                        event: 'subscribed',
                        channel,
                        chanId: channelId
                    }, undefined)
                });
                const state$ = hotState('-');
                const output$ = handleWsSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe('---a', {
                    a: WsActions.subscribeToChannelAck({
                        channel,
                        channelId,
                        request: subscribeRequest
                    })
                });
            });
        });

        it('should handle an error', async () => {
            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    WsSend | WsMessage,
                    any
                >(
                    helpers,
                    {}
                );
                const errorMessage = 'Error';

                const action$ = hotAction('-a-b', {
                    a: WsActions.wsSend({
                        event: 'subscribe',
                        channel: 'topic'
                    }),
                    b: WsActions.wsMessage({
                        event: 'error',
                        msg: errorMessage
                    }, undefined)
                });
                const state$ = hotState('-');
                const output$ = handleWsSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe('---a', {
                    a: WsActions.subscribeToChannelNack({
                        error: errorMessage
                    })
                });
            });
        });

        it('should handle timeout', () => {
            testScheduler.run(helpers => {
                const { hotAction, hotState, expectObservable } = wrapHelpers<
                    WsSend | WsMessage,
                    any
                >(
                    helpers,
                    {}
                );

                const action$ = hotAction(`-a ${WS_SUBSCRIPTION_TIMEOUT_IN_MS}ms `, {
                    a: WsActions.wsSend({
                        event: 'subscribe',
                        channel: 'topic'
                    })
                });
                const state$ = hotState('-');
                const output$ = handleWsSubscription(action$, state$, {} as unknown as Dependencies);

                expectObservable(output$).toBe(`${WS_SUBSCRIPTION_TIMEOUT_IN_MS}ms -(a|)`, {
                    a: WsActions.subscribeToChannelNack({
                        error: 'Timeout'
                    })
                });
            });
        });
    });
});
