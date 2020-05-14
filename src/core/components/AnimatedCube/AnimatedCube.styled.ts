import styled from "styled-components";
import Palette from "theme/style";

export const Container = styled.div<{
  width: number;
}>`
  perspective: ${({ width }) => `${width}px`};
  width: 100%;
  height: 100%;
`;

export const Cube = styled.div<{
  width: number;
}>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transform: ${({ width }) => `translateZ(${-width / 2}px)`};
`;

export const Face = styled.div<{
  width: number;
}>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${Palette.BackgroundColor};
`;

export const FrontFace = styled(Face)`
  transform: ${({ width }) => `rotateY(0deg) translateZ(${width / 2}px)`};
`;

export const RightFace = styled(Face)`
  transform: ${({ width }) => `rotateY(90deg) translateZ(${width / 2}px)`};
  border: 1px solid ${Palette.Border};
`;
