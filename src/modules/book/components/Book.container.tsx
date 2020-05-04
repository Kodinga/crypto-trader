import { connect } from 'react-redux';
import { RootState } from 'modules/root';
import Book, { Props } from './Book'
import { getBook } from '../selectors';
import { getCurrencyPair } from 'modules/selection/selectors';

const mapStateToProps = (state: RootState): Props => {
    const currencyPair = getCurrencyPair(state);
    const orders = currencyPair ? getBook(state)(currencyPair) : [];

    return {
        orders,
        currencyPair
    };
}

export default connect(mapStateToProps)(Book);