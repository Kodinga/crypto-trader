import { getTicker } from './../../selectors';
import { connect } from 'react-redux';
import { RootState } from 'modules/root';
import Ticker, { Props } from './Ticker';

export interface ContainerProps {
    currencyPair: string;
}

const mapStateToProps = (state: RootState, props: ContainerProps): Props => {
    const { currencyPair } = props;
    const ticker = getTicker(state)(currencyPair);
    
    return {
        lastPrice: ticker?.lastPrice,
        currencyPair
    };
}

export default connect(mapStateToProps)(Ticker);