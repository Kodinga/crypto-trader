import React, { FC } from "react";
import AnimatedCube from "core/components/AnimatedCube";

export interface Props {
  currencyPair?: string;
  children?: any;
}

const AnimatedContent: FC<Props> = (props) => {
  const { currencyPair, children } = props;

  return <AnimatedCube trigger={currencyPair}>{children}</AnimatedCube>;
};

export default AnimatedContent;
