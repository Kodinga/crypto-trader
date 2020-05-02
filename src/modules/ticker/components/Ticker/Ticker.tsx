import React, { FC } from 'react';
import { Container, CurrencyPair, Price, RelativeChange, Change } from './Ticker.styled';
import UpdateHighlight from 'core/components/update-highlight/UpdateHighlight';

export interface Props {
    currencyPair: string;
    lastPrice: number;
    dailyChange: number;
    dailyChangeRelative: number;
}

const Ticker: FC<Props> = props => {
    const { currencyPair, lastPrice, dailyChange, dailyChangeRelative } = props;
    const base = currencyPair.slice(0, 3);
    const counter = currencyPair.slice(3);
    return (
        <Container>
            <CurrencyPair>{[base, counter].join(' / ')}</CurrencyPair>
            <Price><UpdateHighlight value={lastPrice?.toFixed(2)} /></Price>
            <RelativeChange isPositive={dailyChangeRelative > 0}>{dailyChangeRelative}{dailyChangeRelative && '%'}</RelativeChange>
            <Change isPositive={dailyChangeRelative > 0}>{dailyChange?.toFixed(2)}</Change>
        </Container>
    );
}

export default Ticker;