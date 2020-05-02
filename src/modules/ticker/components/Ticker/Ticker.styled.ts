import styled from 'styled-components';
import Palette from 'theme/style';

export const Container = styled.div`
    display: grid;
    height: calc(100% - 10px);
    grid-template-rows: 30px 1fr;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: 
        "currencyPair price"
        "relativeChange change";
    font-size: 12px;
    padding: 10px 10px 5px 10px;
    border: 1px solid ${Palette.Border};
`;

export const CurrencyPair = styled.div`
    color: ${Palette.White};
    grid-area: currencyPair;
`;

export const Price = styled.div`
    color: ${Palette.White};
    grid-area: price;
    margin-right: 0;
    margin-left: auto;
`;

export const RelativeChange = styled.div<{
    isPositive: boolean;
}>`
    grid-area: relativeChange;
    font-size: 18px;
    color: ${({isPositive}) => isPositive ? Palette.Positive : Palette.Negative};
`;

export const Change = styled.div<{
    isPositive: boolean;
}>`
    grid-area: change;
    margin-right: 0;
    margin-left: auto;
    color: ${({isPositive}) => isPositive ? Palette.Positive : Palette.Negative};
`;