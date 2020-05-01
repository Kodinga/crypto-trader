import styled from 'styled-components';
import Palette from 'theme/style';

export const Container = styled.div`
    background-color: ${Palette.BackgroundColor};
    width: calc(100vw - 20px);
    height: calc(100vh - 20px);
    display: grid;
    grid-template-rows: 100px 100px 1fr 1fr;
    grid-template-columns: 400px 1fr 1fr;
    grid-template-areas: 
        "header header header"
        "ticker . ."
        "trades chart chart"
        "trades depth book";
    padding: 10px;
`;

export const Header = styled.div`
    grid-area: header;
    color: ${Palette.White};
`;

export const TickersPanel = styled.div`
    grid-area: ticker;
`;

export const TradesPanel = styled.div`
    grid-area: trades;
`