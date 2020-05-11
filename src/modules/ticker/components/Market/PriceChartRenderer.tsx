import React, { FC } from "react";
import LineChart from "core/components/LineChart";
import { Container } from "./PriceChartRenderer.styled";

interface Props {
  value: number[];
}

const PriceChartRenderer: FC<Props> = (props) => {
  const { value: prices } = props;

  return (
    <Container>
      <LineChart values={prices} />
    </Container>
  );
};

export default PriceChartRenderer;
