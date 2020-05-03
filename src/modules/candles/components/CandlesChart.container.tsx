import { connect } from 'react-redux';
import CandlesChart, { Props } from './CandlesChart';
import { RootState } from 'modules/root';
import { getCandles } from '../selectors';
import { getCurrencyPair } from 'modules/selection/selectors';

const mapStateToProps = (state: RootState): Props => {
    const currencyPair = getCurrencyPair(state);
    const candles = currencyPair ? getCandles(state)(currencyPair) : [];
    
    return {
        candles,
        currencyPair
    };
}


export default connect(mapStateToProps)(CandlesChart);