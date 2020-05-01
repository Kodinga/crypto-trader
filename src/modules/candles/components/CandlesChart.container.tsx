import { connect } from 'react-redux';
import CandlesChart, { Props } from './CandlesChart';
import { RootState } from 'modules/root';
import { getCurrencyPairs } from 'modules/reference-data/selectors';
import { getCandles } from '../selectors';

const mapStateToProps = (state: RootState): Props => {
    const currencyPairs = getCurrencyPairs(state);
    const currencyPair = currencyPairs[0];
    const candles = getCandles(state)(currencyPair); // TODO - store selection
    
    return {
        candles
    };
}


export default connect(mapStateToProps)(CandlesChart);