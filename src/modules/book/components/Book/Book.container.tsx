import { connect } from 'react-redux';
import { RootState } from 'modules/root';
import { getSelectedCurrencyPair } from 'modules/selection/selectors';
import Book, { Props } from './Book'
import { getBook } from '../../selectors';

const mapStateToProps = (state: RootState): Props => {
    const selectedCurrencyPair = getSelectedCurrencyPair(state);
    const orders = selectedCurrencyPair ? getBook(state)(selectedCurrencyPair) : [];

    return {
        orders
    };
}

export default connect(mapStateToProps)(Book);