import React, { FC } from "react";
import { Container } from "./Latency.styled";

export interface Props {
  latency?: number;
}

const Latency: FC<Props> = (props) => {
  const { latency } = props;
  return (
    <Container>
      <span>Round trip: </span>
      <span>{latency || "---"}ms</span>
    </Container>
  );
};

export default Latency;
