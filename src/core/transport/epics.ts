import { EMPTY, merge } from 'rxjs';
import { filter, mergeMap, catchError, timeout, take, concatMap, map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Dependencies } from './../../modules/redux/store';
import { WS_ACTION_TYPES, WsSend, WsMessage, WsSubscribeToChannelAck, WsActions, WsSubscribeToChannelNack, WsSubscribeToChannel } from './actions';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { RootState } from 'modules/root';

export const WS_SUBSCRIPTION_TIMEOUT_IN_MS = 1000;

export const handleWsSend: Epic<WsSend, never, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(WS_ACTION_TYPES.WS_SEND),
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
export const handleWsSubscription: Epic<WsSubscribeToChannel | WsMessage | WsSubscribeToChannelAck | WsSubscribeToChannelNack, any, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(WS_ACTION_TYPES.WS_SUBSCRIBE_TO_CHANNEL),
    concatMap(subscribeAction => {
      return merge(
        action$.pipe(
          ofType(WS_ACTION_TYPES.WS_MESSAGE),
          filter(action => {
            return (action.payload.event === 'subscribed' && action.payload.channel === subscribeAction.payload.channel)
              || action.payload.event === 'error'
          }),
          take(1),
          timeout(WS_SUBSCRIPTION_TIMEOUT_IN_MS),
          map((action: any) => {
            if (action.payload.event === 'error') {
              return WsActions.subscribeToChannelNack({
                error: action.payload.msg
              });
            } else {
              const { channel, chanId: channelId } = action.payload;

              return WsActions.subscribeToChannelAck({
                channel,
                channelId,
                request: subscribeAction.payload
              });
            }
          })
        ),
        of(WsActions.wsSend({
          event: 'subscribe',
          ...subscribeAction.payload
        }))
      );
    }),
    catchError(() => of(WsActions.subscribeToChannelNack({
      error: 'Timeout'
    })))
  );

export default combineEpics(
  handleWsSend,
  handleWsSubscription
);