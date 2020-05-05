import { connect } from 'react-redux';
import { RootState } from 'modules/root';
import { Dispatch } from 'redux';
import { SelectionActions } from 'modules/selection/actions';
import { getCurrencyPair } from 'modules/selection/selectors';
import { getTicker } from './../../selectors';
import Ticker, { StateProps, DispatchProps } from './Ticker';

export interface ContainerProps {
    currencyPair: string;
}

const mapStateToProps = (state: RootState, props: ContainerProps): StateProps => {
    const { currencyPair } = props;
    const selectedCurrencyPair = getCurrencyPair(state);
    const ticker = getTicker(state)(currencyPair);
    
    return {
        lastPrice: ticker?.lastPrice,
        currencyPair,
        dailyChangeRelative: ticker?.dailyChangeRelative,
        dailyChange: ticker?.dailyChange,
        isActive: selectedCurrencyPair === currencyPair
    };
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: ContainerProps): DispatchProps => {
    const { currencyPair } = ownProps;

    return {
        onClick: () => dispatch(SelectionActions.selectCurrencyPair({currencyPair}))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Ticker);