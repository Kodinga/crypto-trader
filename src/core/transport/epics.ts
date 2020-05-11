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
  UnsubscribeFromChannel,
} from "./actions";

export const WS_SUBSCRIPTION_TIMEOUT_IN_MS = 5000;

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
          timeout(WS_SUBSCRIPTION_TIMEOUT_IN_MS),
          map((action) => {
            const receiveMessageAction = action as ReceiveMessage;
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

export default combineEpics(handleSendMessage, handleSubscription);
