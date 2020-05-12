import { connect } from "react-redux";
import { RootState } from "modules/root";
import { getSelectedCurrencyPair } from "modules/selection/selectors";
import {
  getSubscriptionId,
  getIsSubscriptionStale,
} from "core/transport/selectors";
import Book, { Props } from "./Book";
import { getBook } from "../../selectors";

const mapStateToProps = (state: RootState): Props => {
  const selectedCurrencyPair = getSelectedCurrencyPair(state);
  const orders = selectedCurrencyPair
    ? getBook(state)(selectedCurrencyPair)
    : [];

  const subscriptionId = getSubscriptionId(state)("book");
  const isStale =
    typeof subscriptionId === "undefined"
      ? false
      : getIsSubscriptionStale(state)(subscriptionId);

  return {
    orders,
    isStale,
  };
};

export default connect(mapStateToProps)(Book);
