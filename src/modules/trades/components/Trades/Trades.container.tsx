import { connect } from 'react-redux';
import { RootState } from 'modules/root';
import Trades, { Props } from './Trades'
import { getTrades } from '../../selectors';
import { getCurrencyPair } from 'modules/selection/selectors';

const mapStateToProps = (state: RootState): Props => {
    const currencyPair = getCurrencyPair(state);
    const trades = currencyPair ? getTrades(state)(currencyPair) : [];

    return {
        trades,
        currencyPair
    };
}

export default connect(mapStateToProps)(Trades);