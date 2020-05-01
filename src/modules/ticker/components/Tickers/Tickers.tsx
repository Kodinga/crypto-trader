import React, { FC } from 'react';
import { Container } from './Tickers.styled';
import Ticker from '../Ticker';

export interface Props {
    currencyPairs: string[];
}

const Tickers: FC<Props> = props => {
    const { currencyPairs } = props;

    return (
        <Container>
            {currencyPairs.map(currencyPair => <Ticker key={currencyPair} currencyPair={currencyPair} />)}
        </Container>
    )
}

export default Tickers;