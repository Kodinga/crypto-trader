import styled from "styled-components";
import Palette from "theme/style";

const barWidth = 5;
const barHeight = 30;
const gap = 2;

const animation = `
    background: ${Palette.LightGray};
    animation: loadingAnimation 1s infinite ease-in-out;
    width: ${barWidth}px;
    height: ${barHeight}px;
`;

export const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "icon"
    "title";

  justify-items: center;
`;

export const Title = styled.div`
  font-size: 11px;
  font-family: FiraSans-Light;
  grid-area: title;
  align-self: flex-start;
  color: ${Palette.LightGray};
`;

export const Animation = styled.div`
  position: relative;
  grid-area: icon;
  align-self: flex-end;
  margin-bottom: 5px;

  @keyframes loadingAnimation {
    0%,
    80%,
    100% {
      box-shadow: 0 0 ${Palette.LightGray};
      height: ${barHeight}px;
    }
    40% {
      box-shadow: 0 -${barWidth}px ${Palette.LightGray};
      height: ${barHeight * 1.2}px;
    }
  }

  ${animation};

  &:before,
  &:after {
    position: absolute;
    content: "";
    ${animation}
  }

  &:before {
    left: ${-barWidth - gap}px;
    animation-delay: -0.2s;
  }

  &:after {
    left: ${barWidth + gap}px;
    animation-delay: 0.2s;
  }
`;
