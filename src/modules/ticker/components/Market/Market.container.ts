import { getCurrencyPair } from 'modules/selection/selectors';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getTickers } from 'modules/ticker/selectors';
import { RootState } from 'modules/root';
import { SelectionActions } from 'modules/selection/actions';
import Market, { StateProps, DispatchProps } from './Market';

const mapStateToProps = (state: RootState): StateProps => {
    const tickers = getTickers(state);
    const selectedCurrencyPair = getCurrencyPair(state);

    return {
        tickers,
        selectedCurrencyPair
    };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {

    return {
        onClick: (currencyPair: string) => dispatch(SelectionActions.selectCurrencyPair({currencyPair}))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);