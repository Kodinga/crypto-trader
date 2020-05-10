import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getSelectedCurrencyPair } from 'modules/selection/selectors';
import { getTickersWithPrices } from 'modules/ticker/selectors';
import { RootState } from 'modules/root';
import { SelectionActions } from 'modules/selection/actions';
import Market, { StateProps, DispatchProps } from './Market';

const mapStateToProps = (state: RootState): StateProps => {
    const tickers = getTickersWithPrices(state);
    const selectedCurrencyPair = getSelectedCurrencyPair(state);

    return {
        tickers,
        selectedCurrencyPair
    };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {

    return {
        onClick: (currencyPair: string) => dispatch(SelectionActions.selectCurrencyPair({ currencyPair }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);