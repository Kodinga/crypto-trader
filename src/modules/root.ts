import { RefDataActions } from './reference-data/actions';
import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import appEpics from './app/epics';
import transportEpics from '../core/transport/epics';
import tradeEpics from './trades/epics';
import refDataEpics from './reference-data/epics';
import { AppActions } from './app/actions';
import { TradeActions } from './trades/actions';
import { WsActions } from 'core/transport/actions';
import { tradesReducer } from './trades/reducer';
import { subscriptionsReducer } from 'core/transport/reducer';
import { refDataReducer } from './reference-data/reducer';

export const rootEpic = combineEpics(
  appEpics,
  refDataEpics,
  transportEpics,
  tradeEpics
);

export const rootReducer = combineReducers({
  refData: refDataReducer,
  subscriptions: subscriptionsReducer,
  trades: tradesReducer
});

export type Actions = AppActions | RefDataActions | WsActions | TradeActions;

export type RootState = ReturnType<typeof rootReducer>;