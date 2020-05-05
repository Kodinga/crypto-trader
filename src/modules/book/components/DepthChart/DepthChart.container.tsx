import { connect } from 'react-redux';
import { RootState } from 'modules/root';
import DepthChart, { Props } from './DepthChart'
import { getDepth } from '../../selectors';
import { getCurrencyPair } from 'modules/selection/selectors';

const mapStateToProps = (state: RootState): Props => {
    const currencyPair = getCurrencyPair(state);
    const depth = currencyPair ? getDepth(state)(currencyPair) : { bids: [], asks: [] };

    return {
        depth
    };
}

export default connect(mapStateToProps)(DepthChart);