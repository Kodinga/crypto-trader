import styled from "styled-components";
import { Container as Stale } from "core/components/Stale/Stale.styled";
import Palette from "theme/style";

export const Container = styled.div<{
  isActive: boolean;
}>`
  position: relative;
  cursor: pointer;
  display: grid;
  grid-template-rows: 25px 1fr;
  height: 50px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "currencyPair price"
    "relativeChange change";
  font-size: 12px;
  padding: 5px 10px;
  border: 1px solid
    ${({ isActive }) => (isActive ? Palette.Orange : Palette.Border)};

  &:hover {
    background-color: #2d3436;
  }

  ${Stale} {
    background: none;
    top: 12px;
    bottom: -12px;
  }
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
  color: ${({ isPositive }) =>
    isPositive ? Palette.Positive : Palette.Negative};
  display: flex;
  font-family: FiraSans-Medium;
`;

export const Change = styled.div<{
  isPositive: boolean;
}>`
  grid-area: change;
  margin-right: 0;
  margin-left: auto;
  color: ${({ isPositive }) =>
    isPositive ? Palette.Positive : Palette.Negative};
`;
