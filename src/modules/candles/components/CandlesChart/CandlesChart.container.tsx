import { connect } from 'react-redux';
import CandlesChart, { Props } from './CandlesChart';
import { RootState } from 'modules/root';
import { getCandles } from '../../selectors';
import { getSelectedCurrencyPair } from 'modules/selection/selectors';

const mapStateToProps = (state: RootState): Props => {
    const selectedCurrencyPair = getSelectedCurrencyPair(state);
    const candles = selectedCurrencyPair ? getCandles(state)(selectedCurrencyPair, '1m') : [];
    
    return {
        candles,
        currencyPair: selectedCurrencyPair
    };
}


export default connect(mapStateToProps)(CandlesChart);