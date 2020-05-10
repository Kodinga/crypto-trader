import { connect } from 'react-redux';
import { RootState } from 'modules/root';
import { getVisibleCurrencyPairTickers } from 'modules/ticker/selectors';
import Tickers, { Props } from './Tickers';

const mapStateToProps = (state: RootState): Props => {
    const { currencyPairs, selectedCurrencyPairIndex } = getVisibleCurrencyPairTickers(state);

    return {
        currencyPairs,
        selectedCurrencyPairIndex
    };
}

export default connect(mapStateToProps)(Tickers);