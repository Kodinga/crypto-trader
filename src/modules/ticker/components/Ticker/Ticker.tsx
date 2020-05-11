import React, { FC } from "react";
import {
  Container,
  CurrencyPair,
  Price,
  RelativeChange,
  Change,
} from "./Ticker.styled";
import UpdateHighlight from "core/components/UpdateHighlight/UpdateHighlight";
import TrendIndicator from "core/components/TrendIndicator";
import { formatCurrencyPair, formatPrice } from "modules/reference-data/utils";

export interface StateProps {
  currencyPair: string;
  lastPrice: number;
  dailyChange: number;
  dailyChangeRelative: number;
  isActive?: boolean;
}

export interface DispatchProps {
  onClick?: () => void;
}

export type Props = StateProps & DispatchProps;

const Ticker: FC<Props> = (props) => {
  const {
    currencyPair,
    lastPrice,
    dailyChange,
    dailyChangeRelative,
    onClick,
    isActive,
  } = props;
  const isPositiveChange = dailyChange > 0;
  const percentChange = dailyChangeRelative
    ? dailyChangeRelative * 100
    : undefined;
  return (
    <Container onClick={onClick} isActive={!!isActive}>
      <CurrencyPair>{formatCurrencyPair(currencyPair)}</CurrencyPair>
      <Price>
        <UpdateHighlight value={formatPrice(lastPrice)} />
      </Price>
      <RelativeChange isPositive={isPositiveChange}>
        <TrendIndicator value={dailyChangeRelative} />
        <UpdateHighlight value={percentChange?.toFixed(2)} />
        {percentChange && "%"}
      </RelativeChange>
      <Change isPositive={isPositiveChange}>
        <UpdateHighlight value={dailyChange?.toFixed(2)} />
      </Change>
    </Container>
  );
};

export default Ticker;
