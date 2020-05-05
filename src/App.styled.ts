import styled from 'styled-components';
import Palette from 'theme/style';

export const Container = styled.div`
    background-color: ${Palette.BackgroundColor};
    width: 100vw;
    height: 100vh;
`;

export const Content = styled.div`
    display: grid;
    grid-template-rows: 40px 80px 1fr 250px;
    grid-template-columns: 400px 400px 1fr;
    grid-template-areas: 
        "header header header"
        "tickers tickers tickers"
        "trades candles candles"
        "trades book depth";
    grid-gap: 5px;
`;

export const Header = styled.div`
    grid-area: header;
    color: ${Palette.White};
    font-family: FiraSans-MediumItalic;
    background-color: #2d3436;
    padding: 0 0 0 10px;
    font-size: 28px;
`;

export const TickersPanel = styled.div`
    grid-area: tickers;
    overflow: auto;
`;

export const TradesPanel = styled.div`
    grid-area: trades;
`;

export const CandlesPanel = styled.div`
    grid-area: candles;
`;

export const BookPanel = styled.div`
    grid-area: book;
`;

export const DepthPanel = styled.div`
    grid-area: depth;
`
