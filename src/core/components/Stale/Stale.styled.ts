import styled from "styled-components";
import Palette from "theme/style";

export const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(34, 34, 34, 0.7);
  pointer-events: none;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  color: ${Palette.White};
  font-family: FiraSans-Medium;
  font-size: 14px;
`;
