import { from } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { ofType } from "ts-action-operators";
import { Epic, combineEpics } from "redux-observable";
import { RootState, Actions } from "modules/root";
import { getSubscriptionId } from "core/transport/selectors";
import { CandlesChannel } from "core/transport/types/Channels";
import { TransportActions } from "core/transport/actions";
import { CandlesActions } from "./actions";
import { Dependencies } from "./../redux/store";

export const subscribeToCandles: Epic<
  Actions,
  Actions,
  RootState | undefined,
  Dependencies | undefined
> = (action$) =>
  action$.pipe(
    ofType(CandlesActions.subscribeToCandles),
    map((action) => {
      const { symbol, timeframe } = action.payload;
      const msg = {
        channel: "candles" as CandlesChannel,
        key: ["trade", timeframe, `t${symbol}`].join(":"),
      };
      return TransportActions.subscribeToChannel(msg);
    })
  );

export const unsubscribeFromCandles: Epic<
  Actions,
  Actions,
  RootState,
  Dependencies
> = (action$, state$) =>
  action$.pipe(
    ofType(CandlesActions.unsubscribeFromCandles),
    mergeMap((action) => {
      const { symbol, timeframe } = action.payload;
      const result: Actions[] = [];

      const channelId = getSubscriptionId(state$.value)("candles", {
        key: ["trade", timeframe, `t${symbol}`].join(":"),
      });
      if (typeof channelId !== "undefined") {
        result.push(
          TransportActions.unsubscribeFromChannel({
            channelId,
          })
        );
      } else {
        console.warn("Failed to find candles subscription");
      }
      return from(result);
    })
  );

export default combineEpics(subscribeToCandles, unsubscribeFromCandles);
