import { connect } from 'react-redux';
import { getCurrencyPairs } from 'modules/reference-data/selectors';
import { RootState } from 'modules/root';
import Tickers, { Props } from './Tickers';

const mapStateToProps = (state: RootState): Props => {
    const currencyPairs = getCurrencyPairs(state);
    
    return {
        currencyPairs
    };
}

export default connect(mapStateToProps)(Tickers);