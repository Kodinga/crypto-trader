import React, { FC, useState, useEffect } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useThrottle } from "core/hooks/useThrottle";
import { Container } from "./DepthChart.styled";
import Palette from "theme/style";
import "theme/Highchart";

interface Depth {
  bids: { price: number; depth: number }[];
  asks: { price: number; depth: number }[];
}

export interface Props {
  depth: Depth;
}

const DepthChart: FC<Props> = (props) => {
  const { depth } = props;
  const throttledDepth = useThrottle<Depth>(depth, 500);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      type: "area",
      animation: false,
    },
    title: {
      text: "",
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "bids",
        type: "area",
        data: [],
      },
      {
        name: "asks",
        type: "area",
        data: [],
      },
    ],
    xAxis: {
      labels: {
        autoRotation: false,
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      area: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    const { bids, asks } = throttledDepth;

    setChartOptions({
      xAxis: {
        categories: [...bids, ...asks].map((order) => order.price.toString()),
        labels: {
          step: 5,
          formatter: function () {
            return Number.parseFloat(this.value.toString()).toFixed(0);
          },
        },
      },
      series: [
        {
          name: "bids",
          type: "area",
          data: [...bids.map((bid) => bid.depth), ...asks.map(() => null)],
          color: Palette.Bid,
        },
        {
          name: "asks",
          type: "area",
          data: [...bids.map(() => null), ...asks.map((ask) => ask.depth)],
          color: Palette.Ask,
        },
      ],
    });
  }, [throttledDepth]);

  return (
    <Container>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        constructorType={"chart"}
      />
    </Container>
  );
};

export default DepthChart;
