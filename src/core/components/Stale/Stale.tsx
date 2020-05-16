import React, { FC } from "react";
import Loading from "core/components/Loading";
import { Container } from "./Stale.styled";

const Stale: FC<{}> = () => {
  return (
    <Container>
      <Loading title={"Stale..."}></Loading>
    </Container>
  );
};

export default Stale;
