import { createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { WsConnectionProxy } from "core/transport/WsConnectionProxy";
import { Connection } from "core/transport/Connection";
import { Actions, RootState, rootEpic, rootReducer } from "../root";

const connectionProxy = new WsConnectionProxy();
const connection = new Connection(connectionProxy);

const dependencies = {
  connection,
};

export type Dependencies = typeof dependencies;

const epicMiddleware = createEpicMiddleware<
  Actions,
  Actions,
  RootState,
  Dependencies
>({
  dependencies,
});

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
