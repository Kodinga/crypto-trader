import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import appEpics from './app/epics';
import transportEpics from '../core/transport/epics';
import tradeEpics from './trades/epics';
import { AppActions } from './app/actions';
import { TradeActions } from './trades/actions';
import { WsActions } from 'core/transport/actions';
import { tradesReducer } from './trades/reducer';
import { subscriptionsReducer } from 'core/transport/reducer';

export const rootEpic = combineEpics(
  appEpics,
  transportEpics,
  tradeEpics
);

export const rootReducer = combineReducers({
  subscriptions: subscriptionsReducer,
  trades: tradesReducer
});

export type Actions = AppActions | WsActions | TradeActions;

export type RootState = ReturnType<typeof rootReducer>;