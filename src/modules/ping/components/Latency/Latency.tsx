import React, { FC } from "react";
import { Container } from "./Latency.styled";

export interface Props {
  latency?: number;
}

const Latency: FC<Props> = (props) => {
  const { latency } = props;
  return <Container>Round trip latency: {latency || "-"}ms</Container>;
};

export default Latency;
