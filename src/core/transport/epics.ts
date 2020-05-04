import { EMPTY, merge } from 'rxjs';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { filter, mergeMap, catchError, timeout, take, concatMap, map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Dependencies } from 'modules/redux/store';
import { RootState, Actions } from 'modules/root';
import { TRANSPORT_ACTION_TYPES, SendMessage, ReceiveMessage, TransportActions, SubscribeToChannel } from './actions';

export const WS_SUBSCRIPTION_TIMEOUT_IN_MS = 2000;

export const handleSendMessage: Epic<Actions, Actions, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(TRANSPORT_ACTION_TYPES.SEND_MESSAGE),
    mergeMap(action => {
      connection.send(JSON.stringify((action as SendMessage).payload));
      return EMPTY;
    })
  );

/*
    The Bitfinex WS api appears to have some limitations when it comes to subscriptions.
    Because requests/responses don't have a correlation id, we can't run concurrent requests safely.
    Therefore, we queue subscription requests and process them sequencially.
*/
export const handleSubscription: Epic<Actions, Actions, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL),
    concatMap(subscribeAction => {
      return merge(
        action$.pipe(
          ofType(TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE),
          filter(action => {
            const receiveMessageAction = action as ReceiveMessage;
            return (receiveMessageAction.payload.event === 'subscribed' && receiveMessageAction.payload.channel === (subscribeAction as SubscribeToChannel).payload.channel)
              || receiveMessageAction.payload.event === 'error'
          }),
          take(1),
          timeout(WS_SUBSCRIPTION_TIMEOUT_IN_MS),
          map(action => {
            const receiveMessageAction = action as ReceiveMessage;
            if (receiveMessageAction.payload.event === 'error') {
              return TransportActions.subscribeToChannelNack({
                error: receiveMessageAction.payload.msg
              });
            } else {
              const { channel, chanId: channelId } = receiveMessageAction.payload;

              return TransportActions.subscribeToChannelAck({
                channel,
                channelId,
                request: (subscribeAction as SubscribeToChannel).payload
              });
            }
          })
        ),
        of(TransportActions.sendMessage({
          event: 'subscribe',
          ...(subscribeAction as SubscribeToChannel).payload
        }))
      );
    }),
    catchError(() => of(TransportActions.subscribeToChannelNack({
      error: 'Timeout'
    })))
  );

export default combineEpics(
  handleSendMessage,
  handleSubscription
);