import styled from 'styled-components';

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: 200px 1fr 1fr;
    grid-template: 
        "header header header"
        "trades chart chart"
        "trades depth book";
`;

export const Header = styled.div`
    grid-area: header;
`;

export const TradesPanel = styled.div`
    grid-area: trades;
`