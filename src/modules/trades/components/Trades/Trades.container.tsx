import { connect } from "react-redux";
import { RootState } from "modules/root";
import Trades, { Props } from "./Trades";
import { getTrades } from "../../selectors";
import { getSelectedCurrencyPair } from "modules/selection/selectors";
import {
  getSubscriptionId,
  getIsSubscriptionStale,
} from "core/transport/selectors";

const mapStateToProps = (state: RootState): Props => {
  const selectedCurrencyPair = getSelectedCurrencyPair(state);
  const trades = selectedCurrencyPair
    ? getTrades(state)(selectedCurrencyPair)
    : [];

  const subscriptionId = getSubscriptionId(state)("trades");
  const isStale =
    typeof subscriptionId === "undefined"
      ? false
      : getIsSubscriptionStale(state)(subscriptionId);

  return {
    trades,
    isStale,
  };
};

export default connect(mapStateToProps)(Trades);
