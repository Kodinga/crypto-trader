import styled from 'styled-components';
import Palette from 'theme/style';

export const Container = styled.div`
    background-color: ${Palette.BackgroundColor};
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`;

export const Content = styled.div`
    display: grid;
    grid-gap: 5px;
    padding: 5px 10px;
    width: 100%;
    height: 100%;
    @media only screen and (min-width: 1200px) {
        grid-template-rows: 40px 70px 1fr 250px 50px;
        grid-template-columns: 400px 1fr 400px;
        grid-template-areas: 
            "header header header"
            "tickers tickers tickers"
            "trades candles candles"
            "trades book depth"
            "footer footer footer";
    }

    @media only screen and (min-width: 600px) and (max-width: 1200px) {
        grid-template-rows: 40px 70px 1fr 250px 50px;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: 
            "header header"
            "tickers tickers"
            "trades book"
            "trades depth"
            "footer footer";

        .candles-chart {
            display: none;
        }
    }

    @media only screen and (max-width: 600px) {
        grid-template-rows: 40px calc(100% - 90px) 50px;
        grid-template-columns: 1fr;
        grid-template-areas: 
            "header"
            "tickers"
            "footer";

        .candles-chart {
            display: none;
        }
    }
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
`;

export const Footer = styled.div`
    grid-area: footer;
`;

