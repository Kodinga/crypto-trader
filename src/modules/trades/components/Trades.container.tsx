import { connect } from 'react-redux';
import { RootState } from 'modules/root';
import Trades, { Props } from './Trades'
import { getTrades } from '../selectors';
import { getCurrencyPairs } from 'modules/reference-data/selectors';

const mapStateToProps = (state: RootState): Props => {
    const currencyPairs = getCurrencyPairs(state);
    const currencyPair = currencyPairs[0];
    const trades = getTrades(state)(currencyPair); // TODO - store selection

    return {
        trades,
        currencyPair
    };
}

export default connect(mapStateToProps)(Trades);