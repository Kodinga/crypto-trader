import React, { FC } from "react";
import { Container, Icon } from "./Latency.styled";

export interface Props {
  latency?: number;
}

const Latency: FC<Props> = (props) => {
  const { latency } = props;
  return (
    <Container>
      <span>Round trip: </span>
      {latency === -1 ? (
        <Icon className="material-icons">warning</Icon>
      ) : (
        <span>{latency || "---"}ms</span>
      )}
    </Container>
  );
};

export default Latency;
