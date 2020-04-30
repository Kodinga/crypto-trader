import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './modules/redux/store';
import { AppActions } from './modules/app/actions';
import { TradeActions } from './modules/trades/actions';
import Trades from 'modules/trades/components';
import { Container, Header, TradesPanel } from 'App.styled';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';

function App() {
  const store = configureStore();
  const symbol = 'tBTCUSD';
  store.dispatch(AppActions.bootstrapApp());
  
  setTimeout(() => {
    store.dispatch(TradeActions.subscribeToSymbol({symbol}));
  }, 2000);
  return (
    <Provider store={store}>
      <Container>
        <Header><h1>Crypto Trader</h1></Header>
        <TradesPanel><Trades symbol={symbol} /></TradesPanel>
      </Container>
     
    </Provider>
  );
}

export default App;
