import React, { FC } from 'react';
import LineChart from 'core/components/LineChart';
import { Container } from './PriceChart.styled';

interface Props {
    value: number[];
}

const PriceChart: FC<Props> = props => {
    const { value: prices } = props;

    return <Container><LineChart values={prices} /></Container>;
};

export default PriceChart;