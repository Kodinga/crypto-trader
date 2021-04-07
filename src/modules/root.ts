import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";
import { AllBookActions } from "./book/actions";
import { AllSelectionActions } from "./selection/actions";
import { AllCandlesActions } from "./candles/actions";
import { AllTickerActions } from "./ticker/actions";
import { AllRefDataActions } from "./reference-data/actions";
import { AllPingActions } from "./ping/actions";
import appEpics from "./app/epics";
import transportEpics from "../core/transport/epics";
import tradeEpics from "./trades/epics";
import refDataEpics from "./reference-data/epics";
import tickerEpics from "./ticker/epics";
import candlesEpics from "./candles/epics";
import selectionEpics from "./selection/epics";
import bookEpics from "./book/epics";
import pingEpics from "./ping/epics";
import { AllAppActions } from "./app/actions";
import { AllTradesActions } from "./trades/actions";
import { AllTransportActions } from "core/transport/actions";
import { tradesReducer } from "./trades/reducer";
import { subscriptionsReducer } from "core/transport/reducer";
import { refDataReducer } from "./reference-data/reducer";
import { tickerReducer } from "./ticker/reducer";
import { candlesReducer } from "./candles/reducer";
import { selectionReducer } from "./selection/reducer";
import { bookReducer } from "./book/reducer";
import { pingReducer } from "./ping/reducer";

export const rootEpic = combineEpics(
  appEpics,
  refDataEpics,
  transportEpics,
  tradeEpics,
  tickerEpics,
  candlesEpics,
  selectionEpics,
  bookEpics,
  pingEpics
);

export const rootReducer = combineReducers({
  refData: refDataReducer,
  subscriptions: subscriptionsReducer,
  trades: tradesReducer,
  ticker: tickerReducer,
  candles: candlesReducer,
  selection: selectionReducer,
  book: bookReducer,
  ping: pingReducer,
});

export type Actions =
  | AllAppActions
  | AllRefDataActions
  | AllTransportActions
  | AllTradesActions
  | AllTickerActions
  | AllCandlesActions
  | AllSelectionActions
  | AllBookActions
  | AllPingActions;

export type RootState = ReturnType<typeof rootReducer>;
