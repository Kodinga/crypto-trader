import { getTicker } from './../../selectors';
import { connect } from 'react-redux';
import { RootState } from 'modules/root';
import Ticker, { StateProps, DispatchProps } from './Ticker';
import { Dispatch } from 'redux';
import { SelectionActions } from 'modules/selection/actions';

export interface ContainerProps {
    currencyPair: string;
}

const mapStateToProps = (state: RootState, props: ContainerProps): StateProps => {
    const { currencyPair } = props;
    const ticker = getTicker(state)(currencyPair);
    
    return {
        lastPrice: ticker?.lastPrice,
        currencyPair,
        dailyChangeRelative: ticker?.dailyChangeRelative,
        dailyChange: ticker?.dailyChange
    };
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: ContainerProps): DispatchProps => {
    const { currencyPair } = ownProps;

    return {
        onClick: () => dispatch(SelectionActions.selectCurrencyPair({currencyPair}))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Ticker);