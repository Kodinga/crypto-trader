import { range } from 'lodash';
import { connect } from 'react-redux';
import { getValueAt } from 'core/utils';
import { getCurrencyPair } from 'modules/selection/selectors';
import { getCurrencyPairs } from 'modules/reference-data/selectors';
import { RootState } from 'modules/root';
import Tickers, { Props } from './Tickers';

const mapStateToProps = (state: RootState): Props => {
    const allCurrencyPairs = getCurrencyPairs(state);
    const selectedCurrencyPair = getCurrencyPair(state);
    let currencyPairs: string[] = [];

    const selectedCurrencyPairIndex = allCurrencyPairs.indexOf(selectedCurrencyPair || '');

    // Pick a few currency pairs on each side of the selected one
    if (selectedCurrencyPairIndex >= 0) {
        currencyPairs = range(selectedCurrencyPairIndex - 2, selectedCurrencyPairIndex + 3)
            .map(index => getValueAt(allCurrencyPairs)(index));
    }

    return {
        currencyPairs,
        selectedCurrencyPairIndex
    };
}

export default connect(mapStateToProps)(Tickers);