import React, { FC, useEffect, useState } from 'react';
import * as Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { Container } from './CandlesChart.styled';
import { Candle } from '../../types/Candle';
import { formatCurrencyPair } from 'modules/reference-data/utils';
import 'theme/Highstock';
import Palette from 'theme/style';

export interface Props {
    candles: Candle[];
    currencyPair?: string;
}

const CandlesChart: FC<Props> = props => {
    const { candles, currencyPair } = props;
    const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
        series: [{
            type: 'candlestick',
            data: []
        }],
        rangeSelector: {
            selected: 1,
            buttons: [{
                type: 'minute',
                count: 5,
                text: '5m'
            }, {
                type: 'minute',
                count: 30,
                text: '30m'
            }, {
                type: 'hour',
                count: 1,
                text: '1h'
            }, {
                type: 'hour',
                count: 12,
                text: '12h'
            }, {
                type: 'all',
                text: 'All'
            }]
        },
    })

    useEffect(() => {
        if (candles && candles.length > 0) {
            const data = candles.map(({ timestamp, ...rest }) => ({
                x: timestamp,
                ...rest
            }))
                .sort((a, b) => a.x - b.x);
            setChartOptions({
                series: [{
                    type: 'candlestick',
                    name: currencyPair && formatCurrencyPair(currencyPair),
                    data
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

    return (
        <Container>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                constructorType={'stockChart'}
            />
        </Container>
    )
}

export default CandlesChart;