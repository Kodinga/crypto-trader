import React, { useEffect } from "react";
import { Provider } from "react-redux";
import configureStore from "./modules/redux/store";
import { AppActions } from "./modules/app/actions";
import Trades from "modules/trades/components/Trades";
import Tickers from "modules/ticker/components/Tickers";
import CandlesChart from "modules/candles/components/CandlesChart";
import Book from "modules/book/components/Book";
import DepthChart from "modules/book/components/DepthChart";
import Market from "modules/ticker/components/Market";
import Widget from "core/components/Widget";
import Diagnostics from "core/components/Diagnostics";
import Latency from "modules/ping/components/Latency";
import CurrencyPairTransition from "modules/common/CurrencyPairTransition";
import {
  Container,
  Content,
  Header,
  MarketPanel,
  TradesPanel,
  TickersPanel,
  CandlesPanel,
  BookPanel,
  DepthPanel,
  Footer,
} from "App.styled";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import "theme/fonts.css";

function App() {
  const store = configureStore();

  useEffect(() => {
    store.dispatch(AppActions.bootstrapApp());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Provider store={store}>
      <Container>
        <Content>
          <Header>Crypto Trader</Header>
          <TickersPanel>
            <Tickers />
          </TickersPanel>
          <MarketPanel>
            <Widget title={"Market"}>
              <Market />
            </Widget>
          </MarketPanel>
          <TradesPanel>
            <Widget title={"Trades"}>
              <CurrencyPairTransition>
                <Trades />
              </CurrencyPairTransition>
            </Widget>
          </TradesPanel>
          <CandlesPanel>
            <CandlesChart />
          </CandlesPanel>
          <BookPanel>
            <Widget title={"Book"}>
              <CurrencyPairTransition>
                <Book />
              </CurrencyPairTransition>
            </Widget>
          </BookPanel>
          <DepthPanel>
            <Widget title={"Depth"}>
              <CurrencyPairTransition>
                <DepthChart />
              </CurrencyPairTransition>
            </Widget>
          </DepthPanel>
          <Footer>
            <Latency />
            <Diagnostics />
          </Footer>
        </Content>
      </Container>
    </Provider>
  );
}

export default App;
