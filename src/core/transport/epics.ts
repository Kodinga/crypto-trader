import { EMPTY, merge, timer, Observable } from "rxjs";
import { ofType } from "ts-action-operators";
import { Epic, combineEpics } from "redux-observable";
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
  switchMap,
} from "rxjs/operators";
import { of } from "rxjs/internal/observable/of";
import { Dependencies } from "modules/redux/store";
import { RootState, Actions } from "modules/root";
import { AppActions } from "modules/app/actions";
import {
  ReceiveMessage,
  TransportActions,
  SubscribeToChannel,
  UnsubscribeFromChannel,
  ChangeConnectionStatus,
} from "./actions";
import { ConnectionStatus } from "./types/ConnectionStatus";

export const SUBSCRIPTION_TIMEOUT_IN_MS = 5000;
export const HEARTBEAT_TIMEOUT_IN_MS = 20000;
export const RECONNECT_AFTER_MS = 1000;

export const handleSendMessage: Epic<
  Actions,
  Actions,
  RootState,
  Dependencies
> = (action$, state$, { connection }) =>
  action$.pipe(
    ofType(TransportActions.sendMessage),
    mergeMap((action) => {
      connection.send(JSON.stringify(action.payload));
      return EMPTY;
    })
  );

export const init: Epic<Actions, Actions, RootState, Dependencies> = (
  action$,
  state$,
  { connection }
) => {
  return action$.pipe(
    ofType(TransportActions.init),
    take(1),
    switchMap((action) => {
      const { wsEndpoint } = action.payload;

      connection.connect(wsEndpoint);

      return new Observable<ReceiveMessage | ChangeConnectionStatus>(
        (subscriber) => {
          connection.onConnect(() => {
            console.log("Connected");

            subscriber.next(
              TransportActions.changeConnectionStatus(
                ConnectionStatus.Connected
              )
            );
          });
          connection.onReceive((data) => {
            const parsedData = JSON.parse(data);
            let meta = undefined;
            let channelId = undefined;

            if (Array.isArray(parsedData)) {
              channelId = parsedData[0];
            } else if (parsedData.hasOwnProperty("chanId")) {
              channelId = parsedData.chanId;
            }
            if (channelId && state$.value.subscriptions[channelId]) {
              meta = state$.value.subscriptions[channelId];
            }
            subscriber.next(TransportActions.receiveMessage(parsedData, meta));
          });
          connection.onClose(() => {
            console.log("Disconnected");

            subscriber.next(
              TransportActions.changeConnectionStatus(
                ConnectionStatus.Disconnected
              )
            );
          });
        }
      );
    })
  );
};

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
    ofType(
      TransportActions.subscribeToChannel,
      TransportActions.unsubscribeFromChannel
    ),
    concatMap((rootAction) => {
      const isSubscribing =
        rootAction.type === TransportActions.subscribeToChannel.type;

      return merge(
        action$.pipe(
          ofType(TransportActions.receiveMessage),
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
  return action$.pipe(
    ofType(TransportActions.subscribeToChannelAck),
    mergeMap((subscribeAction) => {
      const { channelId } = subscribeAction.payload;
      return action$.pipe(
        ofType(TransportActions.receiveMessage),
        filter((action) => action.payload[0] === channelId),
        map(() => null), // Discard action so we don't use memory unnecessarily
        bufferTime(HEARTBEAT_TIMEOUT_IN_MS),
        filter((actions) => actions.length === 0),
        map(() => TransportActions.staleSubscription({ channelId })),
        takeUntil(
          merge(
            action$.pipe(
              ofType(TransportActions.unsubscribeFromChannel),
              filter((action) => action.payload.channelId === channelId)
            ),
            action$.pipe(
              ofType(TransportActions.changeConnectionStatus),
              filter((action) => action.payload === ConnectionStatus.Connected)
            )
          )
        )
      );
    })
  );
};

export const handleReconnection: Epic<
  Actions,
  Actions,
  RootState,
  Dependencies
> = (action$) => {
  return action$.pipe(
    ofType(TransportActions.changeConnectionStatus),
    filter((action) => action.payload === ConnectionStatus.Disconnected),
    switchMap(() =>
      timer(RECONNECT_AFTER_MS).pipe(map(() => AppActions.bootstrapApp()))
    )
  );
};

export default combineEpics(
  init,
  handleSendMessage,
  handleSubscription,
  handleStaleSubscription,
  handleReconnection
);
