import React, { FC, useEffect, useState } from 'react';
import { Container } from './CandlesChart.styled';
import * as Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { Candle } from '../types/Candle';
import darkUnica from 'highcharts/themes/dark-unica';
import Palette from 'theme/style';
import { formatCurrencyPair } from 'modules/reference-data/utils';

export interface Props {
    candles: Candle[];
    currencyPair: string;
}

const CandlesChart: FC<Props> = props => {
    const { candles, currencyPair } = props;
    const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
        series: [{
            type: 'candlestick',
            data: []
        }]
    })
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (candles && candles.length > 0) {
            setChartOptions({
                series: [{
                    type: 'candlestick',
                    name: formatCurrencyPair(currencyPair),
                    data: candles.map(({ timestamp, ...rest }) => ({
                        x: timestamp,
                        ...rest
                    }))
                }],
                plotOptions: {
                    candlestick: {
                        color: Palette.Negative,
                        upColor: Palette.Positive
                    }
                }
            });
        }

    }, [candles, currencyPair]);

    useEffect(() => {
        darkUnica(Highcharts);
        setReady(true);
    }, []);

    return (
        <Container>
            {ready &&
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                    constructorType={'stockChart'}
                />
            }
        </Container>
    )
}

export default CandlesChart;