import { connect } from 'react-redux';
import { RootState } from 'modules/root';
import Trades, { Props } from './Trades'
import { getTrades } from '../selectors';

export interface ContainerProps {
    symbol: string;
}

const mapStateToProps = (state: RootState, containerProps: ContainerProps): Props => {
    const { symbol } = containerProps;
    const trades = getTrades(state)(symbol);

    return {
        trades
    };
}

export default connect(mapStateToProps)(Trades);