import { ConnectionStatus } from 'core/transport/types/ConnectionStatus';
import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Actions, RootState } from './../root';
import { rootEpic, rootReducer } from '../root';
import createWsMiddleware from 'core/transport/middleware';
import { WsConnectionProxy } from 'core/transport/WsConnectionProxy';
import { Connection } from 'core/transport/Connection';
import { WsActions } from 'core/transport/actions';

const connectionProxy = new WsConnectionProxy('wss://api-pub.bitfinex.com/ws/2');

const connection = new Connection(connectionProxy);

const dependencies = {
  connection
};

export type Dependencies = typeof dependencies;

const epicMiddleware = createEpicMiddleware<
  Actions,
  Actions,
  RootState,
  Dependencies
>({
  dependencies
});

const wsMiddleware = createWsMiddleware({connection});

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
  const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(wsMiddleware, epicMiddleware)
    )
  );

  connection.onConnect(() => {
    store.dispatch(WsActions.wsConnectionStatusChanged(ConnectionStatus.Connected));
    console.log('Connected');
  });

  epicMiddleware.run(rootEpic);

  return store;
}