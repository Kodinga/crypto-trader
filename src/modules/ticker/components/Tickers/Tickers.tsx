import React, { FC, useState, useEffect } from "react";
import { usePrevious } from "core/hooks/usePrevious";
import { Container, TickerWrapper, ScrollDirection } from "./Tickers.styled";
import Ticker from "../Ticker";

export interface Props {
  currencyPairs: string[];
  selectedCurrencyPairIndex?: number;
}

const Tickers: FC<Props> = (props) => {
  const { currencyPairs, selectedCurrencyPairIndex } = props;
  const [direction, setDirection] = useState<ScrollDirection>("left");
  const previousSelectedCurrencyPairIndex = usePrevious(
    selectedCurrencyPairIndex
  );

  useEffect(() => {
    const direction =
      (previousSelectedCurrencyPairIndex || 0) >
      (selectedCurrencyPairIndex || 0)
        ? "right"
        : "left";
    setDirection(direction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrencyPairIndex]);

  return (
    <Container className="tickers">
      {currencyPairs.map((currencyPair, index) => (
        <TickerWrapper
          index={index}
          itemCount={currencyPairs.length}
          key={currencyPair}
          direction={direction}
        >
          <Ticker currencyPair={currencyPair} />
        </TickerWrapper>
      ))}
    </Container>
  );
};

export default Tickers;
