import React, { FC } from 'react';
import { Icon } from './TrendIndicator.styled';

export interface Props {
    isPositive: boolean;
}

const TrendIndicator: FC<Props> = props => {
    const { isPositive } = props;

    const icon = isPositive ? 'arrow_upward': 'arrow_downward';
    
    return <Icon className="material-icons">{icon}</Icon>;
};

export default TrendIndicator;