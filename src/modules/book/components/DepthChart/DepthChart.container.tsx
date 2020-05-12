import { connect } from "react-redux";
import { RootState } from "modules/root";
import { getSelectedCurrencyPair } from "modules/selection/selectors";
import {
  getSubscriptionId,
  getIsSubscriptionStale,
} from "core/transport/selectors";
import DepthChart, { Props } from "./DepthChart";
import { getDepth } from "../../selectors";

const mapStateToProps = (state: RootState): Props => {
  const selectedCurrencyPair = getSelectedCurrencyPair(state);
  const depth = selectedCurrencyPair
    ? getDepth(state)(selectedCurrencyPair)
    : { bids: [], asks: [] };

  const subscriptionId = getSubscriptionId(state)("book");
  const isStale =
    typeof subscriptionId === "undefined"
      ? false
      : getIsSubscriptionStale(state)(subscriptionId);

  return {
    depth,
    isStale,
  };
};

export default connect(mapStateToProps)(DepthChart);
