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
import Stale from "core/components/Stale";
import { formatCurrencyPair, formatPrice } from "modules/reference-data/utils";

export interface StateProps {
  currencyPair: string;
  lastPrice: number;
  dailyChange: number;
  dailyChangeRelative: number;
  isActive?: boolean;
  isStale: boolean;
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
    isStale,
  } = props;
  const isPositiveChange = dailyChange > 0;
  const percentChange = dailyChangeRelative
    ? dailyChangeRelative * 100
    : undefined;
  return (
    <Container onClick={onClick} isActive={!!isActive}>
      {isStale ? (
        <Stale />
      ) : (
        <>
          <CurrencyPair>{formatCurrencyPair(currencyPair)}</CurrencyPair>
          <Price>
            <UpdateHighlight value={formatPrice(lastPrice)} effect={"zoom"} />
          </Price>
          <RelativeChange isPositive={isPositiveChange}>
            <TrendIndicator value={dailyChangeRelative} />
            <UpdateHighlight value={percentChange?.toFixed(2)} />
            {percentChange && "%"}
          </RelativeChange>
          <Change isPositive={isPositiveChange}>
            <UpdateHighlight value={dailyChange?.toFixed(2)} />
          </Change>
        </>
      )}
    </Container>
  );
};

export default Ticker;
