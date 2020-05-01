import { EMPTY } from 'rxjs';
import { filter, mergeMap, catchError, timeout, take } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Dependencies } from './../../modules/redux/store';
import { WS_ACTION_TYPES, WsSend, WsMessage, WsSubscribeToChannelAck, WsActions, WsSubscribeToChannelNack } from './actions';
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
    When we have concurrent subscription requests to the same channel, but with different payload, there is no
    way to distinguish which response is for which request.

    Ideally, we would have some sort of correlation id between the request and the response.
*/
export const handleWsSubscription: Epic<WsSend | WsMessage | WsSubscribeToChannelAck | WsSubscribeToChannelNack, WsSubscribeToChannelAck | WsSubscribeToChannelNack, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(WS_ACTION_TYPES.WS_SEND),
    filter(action => action.payload.event === 'subscribe'),
    mergeMap(subscribeAction => {
      return action$.pipe(
        ofType(WS_ACTION_TYPES.WS_MESSAGE),
        filter(action => {
          return (action.payload.event === 'subscribed' && action.payload.channel === subscribeAction.payload.channel)
          || action.payload.event === 'error'
        }),
        take(1),
        timeout(WS_SUBSCRIPTION_TIMEOUT_IN_MS),
        mergeMap(action => {
          // Note - sadly, the payload doesn't say which channel the error is for, 
          // so if we have concurrent requests, we can't tell for sure which request has failed
          if (action.payload.event === 'error') {
            return of(WsActions.subscribeToChannelNack({
              error: action.payload.msg
            }));
          } else {
            const { channel, chanId: channelId } = action.payload;

            return of(WsActions.subscribeToChannelAck({
              channel,
              channelId,
              request: subscribeAction.payload
            }));
          }
        })
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