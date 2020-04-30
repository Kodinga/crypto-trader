import { EMPTY } from 'rxjs';
import { filter, switchMap, catchError, timeout, take } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { Dependencies } from './../../modules/redux/store';
import { WS_ACTION_TYPES, WsSendAction, WsMessageAction, WsSubscribeToChannelAck, WsActions, WsSubscribeToChannelNack } from './actions';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { RootState } from 'modules/root';

export const WS_SUBSCRIPTION_TIMEOUT_IN_MS = 1000;

export const handleWsSend: Epic<WsSendAction, never, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(WS_ACTION_TYPES.WS_SEND),
    mergeMap(action => {
      connection.send(JSON.stringify(action.payload));
      return EMPTY;
    })
  );


export const handleWsSubscription: Epic<WsSendAction | WsMessageAction | WsSubscribeToChannelAck | WsSubscribeToChannelNack, WsSubscribeToChannelAck | WsSubscribeToChannelNack, RootState, Dependencies> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(WS_ACTION_TYPES.WS_SEND),
    filter(action => action.payload.event === 'subscribe'),
    switchMap(subscribeAction => {
      return action$.pipe(
        ofType(WS_ACTION_TYPES.WS_MESSAGE),
        filter(action => {
          return (action.payload.event === 'subscribed' && action.payload.channel === subscribeAction.payload.channel)
          || action.payload.event === 'error'
        }),
        take(1),
        timeout(WS_SUBSCRIPTION_TIMEOUT_IN_MS),
        mergeMap(action => {
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