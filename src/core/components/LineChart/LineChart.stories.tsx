import React, { FC } from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { StoryFn } from '@storybook/addons'
import LineChart from './LineChart';
import Palette from 'theme/style';

const width = 100;
const height = 30;

const Container: FC<any> = ({children}) => (
    <div style={{width: `${width}px`, height: `${height}px`, backgroundColor: Palette.BackgroundColor}}>
        {children}
    </div>
)
export default {
    title: 'LineChart',
    component: LineChart,
    decorators: [withKnobs, (storyFn: StoryFn) => <Container>{storyFn()}</Container>]
};

export const Default = () => {
    return <LineChart values={[50, 100, 75]} width={width} height={height} />;
};
