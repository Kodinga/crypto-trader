import { EMPTY, merge } from "rxjs";
import { Epic, ofType, combineEpics } from "redux-observable";
import {
  filter,
  mergeMap,
  catchError,
  timeout,
  take,
  concatMap,
  map,
  bufferTime,
  takeUntil,
} from "rxjs/operators";
import { of } from "rxjs/internal/observable/of";
import { Dependencies } from "modules/redux/store";
import { RootState, Actions } from "modules/root";
import {
  TRANSPORT_ACTION_TYPES,
  SendMessage,
  ReceiveMessage,
  TransportActions,
  SubscribeToChannel,
  SubscribeToChannelAck,
  UnsubscribeFromChannel,
} from "./actions";

export const SUBSCRIPTION_TIMEOUT_IN_MS = 5000;
export const HEARTBEAT_TIMEOUT_IN_MS = 20000;

export const handleSendMessage: Epic<
  Actions,
  Actions,
  RootState,
  Dependencies
> = (action$, state$, { connection }) =>
    action$.pipe(
      ofType<Actions, SendMessage>(TRANSPORT_ACTION_TYPES.SEND_MESSAGE),
      mergeMap((action) => {
        connection.send(JSON.stringify(action.payload));
        return EMPTY;
      })
    );

/*
    The Bitfinex WS api appears to have some limitations when it comes to subscriptions.
    Because requests/responses don't have a correlation id, we can't run concurrent requests safely.
    Therefore, we queue subscription requests and process them sequencially.
*/
export const handleSubscription: Epic<
  Actions,
  Actions,
  RootState,
  Dependencies
> = (action$) => {
  return action$.pipe(
    ofType<Actions, SubscribeToChannel | UnsubscribeFromChannel>(
      TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL,
      TRANSPORT_ACTION_TYPES.UNSUBSCRIBE_FROM_CHANNEL
    ),
    concatMap((rootAction) => {
      const isSubscribing =
        rootAction.type === TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL;

      return merge(
        action$.pipe(
          ofType<Actions, ReceiveMessage>(
            TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE
          ),
          filter((action) => {
            return (
              (isSubscribing &&
                action.payload.event === "subscribed" &&
                action.payload.channel ===
                (rootAction as SubscribeToChannel).payload.channel) ||
              (!isSubscribing && action.payload.event === "unsubscribed") ||
              action.payload.event === "error"
            );
          }),
          take(1),
          timeout(SUBSCRIPTION_TIMEOUT_IN_MS),
          map((receiveMessageAction) => {
            if (receiveMessageAction.payload.event === "error") {
              return isSubscribing
                ? TransportActions.subscribeToChannelNack({
                  error: receiveMessageAction.payload.msg,
                })
                : TransportActions.unsubscribeFromChannelNack();
            } else {
              const {
                channel,
                chanId: channelId,
              } = receiveMessageAction.payload;

              return isSubscribing
                ? TransportActions.subscribeToChannelAck({
                  channel,
                  channelId,
                  request: (rootAction as SubscribeToChannel).payload,
                })
                : TransportActions.unsubscribeFromChannelAck({
                  channelId,
                });
            }
          }),
          catchError(() =>
            isSubscribing
              ? of(
                TransportActions.subscribeToChannelNack({
                  error: "Timeout",
                })
              )
              : of(TransportActions.unsubscribeFromChannelNack())
          )
        ),
        isSubscribing
          ? of(
            TransportActions.sendMessage({
              event: "subscribe",
              ...(rootAction as SubscribeToChannel).payload,
            })
          )
          : of(
            TransportActions.sendMessage({
              event: "unsubscribe",
              chanId: (rootAction as UnsubscribeFromChannel).payload
                .channelId,
            })
          )
      );
    })
  );
};

export const handleStaleSubscription: Epic<
  Actions,
  Actions,
  RootState,
  Dependencies
> = (action$) => {
  return action$
    .pipe(
      ofType<Actions, SubscribeToChannelAck>(TRANSPORT_ACTION_TYPES.SUBSCRIBE_TO_CHANNEL_ACK),
      mergeMap(subscribeAction => {
        const { channelId } = subscribeAction.payload;
        return action$
          .pipe(
            ofType<Actions, ReceiveMessage>(TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE),
            filter(action => action.payload[0] === channelId),
            bufferTime(HEARTBEAT_TIMEOUT_IN_MS),
            mergeMap(actions => {
              if (actions.length === 0) {
                return of(TransportActions.staleSubscription({ channelId }));
              }
              return EMPTY;
            }),
            takeUntil(action$.pipe(
              ofType<Actions, UnsubscribeFromChannel>(TRANSPORT_ACTION_TYPES.UNSUBSCRIBE_FROM_CHANNEL),
              filter(action => action.payload.channelId === channelId)
            ))
          )
      })
    )
};

export default combineEpics(handleSendMessage, handleSubscription, handleStaleSubscription);
