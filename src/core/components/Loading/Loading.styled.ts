import styled from "styled-components";
import Palette from "theme/style";

const barWidth = 10;
const gap = 4;

const animation = `
    background: ${Palette.LightGray};
    animation: loadingAnimation 1s infinite ease-in-out;
    width: ${barWidth}px;
    height: 40px;
`;

export const Animation = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 1;

  @keyframes loadingAnimation {
    0%,
    80%,
    100% {
      box-shadow: 0 0 ${Palette.LightGray};
      height: 40px;
    }
    40% {
      box-shadow: 0 -${barWidth}px ${Palette.LightGray};
      height: 50px;
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
