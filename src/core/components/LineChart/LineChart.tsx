import React, { FC } from 'react';
import { SvgContainer } from './LineChart.styled';
import Palette from 'theme/style';

interface Props {
    values: number[];
    width?: number;
    height?: number;
}

const LineChart: FC<Props> = props => {
    const { values, width = 50, height = 25 } = props;
    const maxX = values.length - 1;
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const diff = maxValue - minValue;
   
    const getSvgX = (x: number) => (x / maxX) * width;

    const getSvgY = (y: number) => height - ((y - minValue) * height / diff);

    if (values.length === 0) {
        return <div></div>
    }

    let pathD = `M ${getSvgX(0)} ${getSvgY(values[0])} `;
    pathD += values.map((value, i) => {
        const x = getSvgX(i);
        const y = getSvgY(value);

        return `L  ${x}  ${y} `;
    });

    return (
        <SvgContainer viewBox={`0 0 ${width} ${height}`}>
            <path d={pathD} style={{ stroke: Palette.LightGray }} />
        </SvgContainer>
    );
};

export default LineChart;