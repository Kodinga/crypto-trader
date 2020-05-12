import styled from "styled-components";
import Palette from "theme/style";

export const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 20px 1fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "body";
`;

export const Header = styled.div`
  grid-area: header;
  color: ${Palette.Label};
  font-size: 12px;
`;

export const Body = styled.div`
  grid-area: body;
`;
