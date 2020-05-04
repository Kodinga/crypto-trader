import styled from 'styled-components';
import Palette from 'theme/style';

export const Container = styled.div`
    width: 100%;
    height: calc(100% - 20px);
    font-family: FiraSans-Light;
`;

export const Header = styled.div`
    height: 20px;
    font-family: FiraSans-Regular;

    > span {
        color: ${Palette.Label};
    }
`
