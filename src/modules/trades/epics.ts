import { from } from "rxjs";
import { ofType } from "ts-action-operators";
import { map, mergeMap } from "rxjs/operators";
import { Epic, combineEpics } from "redux-observable";
import { RootState, Actions } from "modules/root";
import { TradesChannel } from "core/transport/types/Channels";
import { TradesActions } from "modules/trades/actions";
import { TransportActions } from "core/transport/actions";
import { getSubscriptionId } from "core/transport/selectors";
import { Dependencies } from "./../redux/store";

export const subscribeToTrades: Epic<
  Actions,
  Actions,
  RootState,
  Dependencies
> = (action$) =>
  action$.pipe(
    ofType(TradesActions.subscribeToTrades),
    map((action) => {
      const { symbol } = action.payload;
      const msg = {
        channel: "trades" as TradesChannel,
        symbol: `t${symbol}`,
      };
      return TransportActions.subscribeToChannel(msg);
    })
  );

export const unsubscribeFromTrades: Epic<
  Actions,
  Actions,
  RootState,
  Dependencies
> = (action$, state$) =>
  action$.pipe(
    ofType(TradesActions.unsubscribeFromTrades),
    mergeMap((action) => {
      const { symbol } = action.payload;
      const result: Actions[] = [];
      const channelId = getSubscriptionId(state$.value)("trades", {
        symbol: `t${symbol}`,
      });
      if (typeof channelId !== "undefined") {
        result.push(
          TransportActions.unsubscribeFromChannel({
            channelId,
          })
        );
      } else {
        console.warn("Failed to find trades subscription");
      }
      return from(result);
    })
  );

export default combineEpics(subscribeToTrades, unsubscribeFromTrades);
