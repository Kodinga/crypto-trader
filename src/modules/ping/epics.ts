import { combineEpics, Epic } from "redux-observable";
import { ofType } from "ts-action-operators";
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
import { TransportActions } from "core/transport/actions";
import { Actions, RootState } from "modules/root";
import { Dependencies } from "modules/redux/store";
import { ConnectionStatus } from "core/transport/types/ConnectionStatus";

export const PING_INTERVAL_IN_MS = 5000;

export const pingPong: Epic<Actions, Actions, RootState, Dependencies> = (
  action$
) =>
  action$.pipe(
    ofType(TransportActions.changeConnectionStatus),
    filter((action) => action.payload === ConnectionStatus.Connected),
    switchMap(() => {
      return interval(PING_INTERVAL_IN_MS).pipe(
        switchMap((i) => {
          const cid = i + 1;
          const pingTimestamp = Date.now();
          return merge(
            action$.pipe(
              ofType(TransportActions.receiveMessage),
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
