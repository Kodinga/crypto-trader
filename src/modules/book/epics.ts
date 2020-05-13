import { from } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { Epic, ofType, combineEpics } from "redux-observable";
import { getSubscriptionId } from "core/transport/selectors";
import { TransportActions } from "core/transport/actions";
import { BookChannel } from "core/transport/types/Channels";
import { RootState, Actions } from "modules/root";
import {
  SubscribeToBook,
  BOOK_ACTION_TYPES,
  UnsubscribeFromBook,
} from "./actions";
import { Dependencies } from "./../redux/store";

export const subscribeToBook: Epic<
  Actions,
  Actions,
  RootState | undefined,
  Dependencies | undefined
> = (action$) =>
  action$.pipe(
    ofType<Actions, SubscribeToBook>(BOOK_ACTION_TYPES.SUBSCRIBE_TO_BOOK),
    map((action) => {
      const { symbol } = action.payload;
      const msg = {
        channel: "book" as BookChannel,
        symbol: `t${symbol}`,
        prec: "R0",
      };
      return TransportActions.subscribeToChannel(msg);
    })
  );

export const unsubscribeFromBook: Epic<
  Actions,
  Actions,
  RootState,
  Dependencies
> = (action$, state$) =>
  action$.pipe(
    ofType<Actions, UnsubscribeFromBook>(
      BOOK_ACTION_TYPES.UNSUBSCRIBE_FROM_BOOK
    ),
    mergeMap((action) => {
      const { symbol } = action.payload;
      const result: Actions[] = [];
      const channelId = getSubscriptionId(state$.value)("book", {
        symbol: `t${symbol}`,
      });
      if (typeof channelId !== "undefined") {
        result.push(
          TransportActions.unsubscribeFromChannel({
            channelId,
          })
        );
      } else {
        console.warn("Failed to find book subscription");
      }
      return from(result);
    })
  );

export default combineEpics(subscribeToBook, unsubscribeFromBook);
