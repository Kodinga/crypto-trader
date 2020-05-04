import { EMPTY, merge } from 'rxjs';
import { filter, mergeMap, catchError, timeout, take, concatMap, map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Dependencies } from './../../modules/redux/store';
import { TRANSPORT_ACTION_TYPES, SendMessage, ReceiveMessage, SubscribeToChannelAck, TransportActions, SubscribeToChannelNack, SubscribeToChannel } from './actions';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { RootState } from 'modules/root';

export const WS_SUBSCRIPTION_TIMEOUT_IN_MS = 2000;

export const handleSendMessage: Epic<SendMessage, never, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(TRANSPORT_ACTION_TYPES.SEND_MESSAGE),
    mergeMap(action => {
      connection.send(JSON.stringify(action.payload));
      return EMPTY;
    })
  );

/*
    The Bitfinex WS api seems to have some limitations when it comes to subscriptions.
    Because request/response don't have a correlation id, we can't safely do concurrent requests.
    To be safe, we therefore queue subscription requests up, and process them sequencially.
*/
export const handleSubscription: Epic<SubscribeToChannel | ReceiveMessage | SubscribeToChannelAck | SubscribeToChannelNack, any, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL),
    concatMap(subscribeAction => {
      return merge(
        action$.pipe(
          ofType(TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE),
          filter(action => {
            return (action.payload.event === 'subscribed' && action.payload.channel === subscribeAction.payload.channel)
              || action.payload.event === 'error'
          }),
          take(1),
          timeout(WS_SUBSCRIPTION_TIMEOUT_IN_MS),
          map((action: any) => {
            if (action.payload.event === 'error') {
              return TransportActions.subscribeToChannelNack({
                error: action.payload.msg
              });
            } else {
              const { channel, chanId: channelId } = action.payload;

              return TransportActions.subscribeToChannelAck({
                channel,
                channelId,
                request: subscribeAction.payload
              });
            }
          })
        ),
        of(TransportActions.sendMessage({
          event: 'subscribe',
          ...subscribeAction.payload
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