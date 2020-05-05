import { connect } from 'react-redux';
import { RootState } from 'modules/root';
import { getCurrencyPair } from 'modules/selection/selectors';
import Book, { Props } from './Book'
import { getBook } from '../../selectors';

const mapStateToProps = (state: RootState): Props => {
    const currencyPair = getCurrencyPair(state);
    const orders = currencyPair ? getBook(state)(currencyPair) : [];

    return {
        orders
    };
}

export default connect(mapStateToProps)(Book);