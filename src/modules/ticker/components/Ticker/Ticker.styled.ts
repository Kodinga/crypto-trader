import styled from 'styled-components';
import Palette from 'theme/style';

export const Container = styled.div`
    display: flex;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
`;

export const CurrencyPair = styled.div`
    color: ${Palette.Label};
`;

export const Price = styled.div`
    color: ${Palette.White};
`;