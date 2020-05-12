import { connect } from "react-redux";
import { getSubscriptionId, getIsSubscriptionStale } from "core/transport/selectors";
import CandlesChart, { Props } from "./CandlesChart";
import { RootState } from "modules/root";
import { getCandles } from "../../selectors";
import { getSelectedCurrencyPair } from "modules/selection/selectors";

const mapStateToProps = (state: RootState): Props => {
  const selectedCurrencyPair = getSelectedCurrencyPair(state);
  const candles = selectedCurrencyPair
    ? getCandles(state)(selectedCurrencyPair, "1m")
    : [];


  const subscriptionId = getSubscriptionId(state)('candles');
  const isStale = typeof subscriptionId === 'undefined' ? false : getIsSubscriptionStale(state)(subscriptionId);

  return {
    candles,
    currencyPair: selectedCurrencyPair,
    isStale
  };
};

export default connect(mapStateToProps)(CandlesChart);
