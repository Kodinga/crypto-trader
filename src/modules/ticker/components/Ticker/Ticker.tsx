import React, { FC } from 'react';
import { Container, CurrencyPair, Price, RelativeChange, Change } from './Ticker.styled';
import UpdateHighlight from 'core/components/update-highlight/UpdateHighlight';
import { formatCurrencyPair } from 'modules/reference-data/utils';
import TrendIndicator from 'core/components/trend-indicator';

export interface Props {
    currencyPair: string;
    lastPrice: number;
    dailyChange: number;
    dailyChangeRelative: number;
}

const Ticker: FC<Props> = props => {
    const { currencyPair, lastPrice, dailyChange, dailyChangeRelative } = props;
    const isPositiveChange = dailyChange > 0;
    return (
        <Container>
            <CurrencyPair>{formatCurrencyPair(currencyPair)}</CurrencyPair>
            <Price><UpdateHighlight value={lastPrice?.toFixed(2)} /></Price>
            <RelativeChange isPositive={isPositiveChange}>
                <TrendIndicator isPositive={isPositiveChange} />
                <UpdateHighlight value={dailyChangeRelative?.toString()} />
                {dailyChangeRelative && '%'}
            </RelativeChange>
            <Change isPositive={isPositiveChange}><UpdateHighlight value={dailyChange?.toFixed(2)} /></Change>
        </Container>
    );
}

export default Ticker;