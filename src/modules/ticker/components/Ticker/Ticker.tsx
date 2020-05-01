import React, { FC } from 'react';
import { Container, CurrencyPair, Price } from './Ticker.styled';
import UpdateHighlight from 'core/components/update-highlight/UpdateHighlight';

export interface Props {
    currencyPair: string;
    lastPrice: number;
}

const Ticker: FC<Props> = props => {
    const { currencyPair, lastPrice } = props;

    return (
        <Container>
            <CurrencyPair>{currencyPair}</CurrencyPair>
            <Price><UpdateHighlight value={lastPrice?.toString()} /></Price>
        </Container>
    );
}

export default Ticker;