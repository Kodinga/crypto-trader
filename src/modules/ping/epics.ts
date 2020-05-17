import { combineEpics, Epic, ofType } from "redux-observable";
import { interval, merge, of } from "rxjs";
import {
  filter,
  switchMap,
  map,
  timeout,
  catchError,
  take,
} from "rxjs/operators";
import { PingActions } from "./actions";
import { ReceiveMessage } from "core/transport/actions";
import { TransportActions } from "core/transport/actions";
import { Actions, RootState } from "modules/root";
import { Dependencies } from "modules/redux/store";
import { TRANSPORT_ACTION_TYPES } from "core/transport/actions";
import { ChangeConnectionStatus } from "core/transport/actions";
import { ConnectionStatus } from "core/transport/types/ConnectionStatus";

export const PING_INTERVAL_IN_MS = 5000;

export const pingPong: Epic<Actions, Actions, RootState, Dependencies> = (
  action$
) =>
  action$.pipe(
    ofType<Actions, ChangeConnectionStatus>(
      TRANSPORT_ACTION_TYPES.CHANGE_CONNECTION_STATUS
    ),
    filter((action) => action.payload === ConnectionStatus.Connected),
    switchMap(() => {
      return interval(PING_INTERVAL_IN_MS).pipe(
        switchMap((i) => {
          const cid = i + 1;
          const pingTimestamp = Date.now();
          return merge(
            action$.pipe(
              ofType<Actions, ReceiveMessage>(
                TRANSPORT_ACTION_TYPES.RECEIVE_MESSAGE
              ),
              filter(
                (action) =>
                  !Array.isArray(action.payload) &&
                  action.payload.event === "pong" &&
                  action.payload.cid === cid
              ),
              take(1),
              timeout(PING_INTERVAL_IN_MS - 100),
              map(() =>
                PingActions.updateLatency({
                  latency: Date.now() - pingTimestamp,
                })
              ),
              catchError(() =>
                of(
                  PingActions.updateLatency({
                    latency: -1,
                  })
                )
              )
            ),
            of(
              TransportActions.sendMessage({
                event: "ping",
                cid,
              })
            )
          );
        })
      );
    })
  );

export default combineEpics(pingPong);
