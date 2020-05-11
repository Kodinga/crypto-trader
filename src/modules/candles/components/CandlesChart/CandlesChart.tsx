import React, { FC, useEffect, useState } from "react";
import * as Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { Container } from "./CandlesChart.styled";
import { Candle } from "../../types/Candle";
import { formatCurrencyPair } from "modules/reference-data/utils";
import "theme/Highstock";
import Palette from "theme/style";

export interface Props {
  candles: Candle[];
  currencyPair?: string;
}

const CandlesChart: FC<Props> = (props) => {
  const { candles, currencyPair } = props;
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    time: {
      useUTC: false,
    },
    yAxis: [
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "OHLC",
        },
        height: "70%",
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Volume",
        },
        top: "75%",
        height: "25%",
        offset: 0,
        lineWidth: 2,
      },
    ],
    series: [
      {
        type: "candlestick",
        data: [],
      },
      {
        type: "column",
        name: "Volume",
        data: [],
        yAxis: 1,
      },
    ],
    rangeSelector: {
      selected: 2,
      buttons: [
        {
          type: "minute",
          count: 5,
          text: "5m",
        },
        {
          type: "minute",
          count: 15,
          text: "15m",
        },
        {
          type: "minute",
          count: 30,
          text: "30m",
        },
        {
          type: "hour",
          count: 1,
          text: "1h",
        },
        {
          type: "hour",
          count: 12,
          text: "12h",
        },
        {
          type: "all",
          text: "All",
        },
      ],
    },
  });

  useEffect(() => {
    if (candles && candles.length > 0) {
      const ohlc = candles
        .map(({ timestamp, ...rest }) => ({
          x: timestamp,
          ...rest,
        }))
        .sort((a, b) => a.x - b.x);
      const volumes = candles
        .map(({ timestamp, volume }) => [timestamp, volume])
        .sort((a, b) => a[0] - b[0]);

      setChartOptions({
        series: [
          {
            type: "candlestick",
            name: currencyPair && formatCurrencyPair(currencyPair),
            data: ohlc,
          },
          {
            type: "column",
            data: volumes,
          },
        ],
        plotOptions: {
          candlestick: {
            color: Palette.Negative,
            upColor: Palette.Positive,
          },
          column: {
            color: Palette.LightGray,
          },
        },
      });
    }
  }, [candles, currencyPair]);

  return (
    <Container className="candles-chart">
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        constructorType={"stockChart"}
      />
    </Container>
  );
};

export default CandlesChart;
