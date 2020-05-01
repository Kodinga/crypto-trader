import { TickerActions } from './ticker/actions';
import { RefDataActions } from './reference-data/actions';
import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import appEpics from './app/epics';
import transportEpics from '../core/transport/epics';
import tradeEpics from './trades/epics';
import refDataEpics from './reference-data/epics';
import tickerEpics from './ticker/epics';
import { AppActions } from './app/actions';
import { TradeActions } from './trades/actions';
import { WsActions } from 'core/transport/actions';
import { tradesReducer } from './trades/reducer';
import { subscriptionsReducer } from 'core/transport/reducer';
import { refDataReducer } from './reference-data/reducer';
import { tickerReducer } from './ticker/reducer';

export const rootEpic = combineEpics(
  appEpics,
  refDataEpics,
  transportEpics,
  tradeEpics,
  tickerEpics
);

export const rootReducer = combineReducers({
  refData: refDataReducer,
  subscriptions: subscriptionsReducer,
  trades: tradesReducer,
  ticker: tickerReducer
});

export type Actions = AppActions | RefDataActions | WsActions | TradeActions | TickerActions;

export type RootState = ReturnType<typeof rootReducer>;