import { map } from "rxjs/operators";
import { Epic, combineEpics } from "redux-observable";
import { ofType } from "ts-action-operators";
import { TransportActions } from "core/transport/actions";
import { TickerChannel } from "core/transport/types/Channels";
import { RootState, Actions } from "modules/root";
import { TickerActions } from "./actions";
import { Dependencies } from "./../redux/store";

export const subscribeToTicker: Epic<
  Actions,
  Actions,
  RootState | undefined,
  Dependencies | undefined
> = (action$) =>
  action$.pipe(
    ofType(TickerActions.subscribeToTicker),
    map((action) => {
      const { symbol } = action.payload;
      const msg = {
        channel: "ticker" as TickerChannel,
        symbol: `t${symbol}`,
      };
      return TransportActions.subscribeToChannel(msg);
    })
  );

export default combineEpics(subscribeToTicker);
