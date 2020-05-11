import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";
import { BookActions } from "./book/actions";
import { SelectionActions } from "./selection/actions";
import { CandlesActions } from "./candles/actions";
import { TickerActions } from "./ticker/actions";
import { RefDataActions } from "./reference-data/actions";
import appEpics from "./app/epics";
import transportEpics from "../core/transport/epics";
import tradeEpics from "./trades/epics";
import refDataEpics from "./reference-data/epics";
import tickerEpics from "./ticker/epics";
import candlesEpics from "./candles/epics";
import selectionEpics from "./selection/epics";
import bookEpics from "./book/epics";
import { AppActions } from "./app/actions";
import { TradesActions } from "./trades/actions";
import { TransportActions } from "core/transport/actions";
import { tradesReducer } from "./trades/reducer";
import { subscriptionsReducer } from "core/transport/reducer";
import { refDataReducer } from "./reference-data/reducer";
import { tickerReducer } from "./ticker/reducer";
import { candlesReducer } from "./candles/reducer";
import { selectionReducer } from "./selection/reducer";
import { bookReducer } from "./book/reducer";

export const rootEpic = combineEpics(
  appEpics,
  refDataEpics,
  transportEpics,
  tradeEpics,
  tickerEpics,
  candlesEpics,
  selectionEpics,
  bookEpics
);

export const rootReducer = combineReducers({
  refData: refDataReducer,
  subscriptions: subscriptionsReducer,
  trades: tradesReducer,
  ticker: tickerReducer,
  candles: candlesReducer,
  selection: selectionReducer,
  book: bookReducer,
});

export type Actions =
  | AppActions
  | RefDataActions
  | TransportActions
  | TradesActions
  | TickerActions
  | CandlesActions
  | SelectionActions
  | BookActions;

export type RootState = ReturnType<typeof rootReducer>;
