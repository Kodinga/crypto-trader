import React, { FC } from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { StoryFn } from '@storybook/addons'
import Ticker from './Ticker';
import Palette from 'theme/style';

const Container: FC<any> = ({children}) => (
    <div style={{width: '270px', minHeight: '70px', backgroundColor: Palette.BackgroundColor}}>
        {children}
    </div>
)
export default {
    title: 'Ticker',
    component: Ticker,
    decorators: [withKnobs, (storyFn: StoryFn) => <Container>{storyFn()}</Container>]
};

export const Default = () => {
    return <Ticker currencyPair={'BTCUSD'} lastPrice={7540.45} dailyChangeRelative={-3.5} dailyChange={-210.3} />;
};
