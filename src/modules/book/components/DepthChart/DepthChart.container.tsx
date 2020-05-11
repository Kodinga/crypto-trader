import { connect } from "react-redux";
import { RootState } from "modules/root";
import { getSelectedCurrencyPair } from "modules/selection/selectors";
import DepthChart, { Props } from "./DepthChart";
import { getDepth } from "../../selectors";

const mapStateToProps = (state: RootState): Props => {
  const selectedCurrencyPair = getSelectedCurrencyPair(state);
  const depth = selectedCurrencyPair
    ? getDepth(state)(selectedCurrencyPair)
    : { bids: [], asks: [] };

  return {
    depth,
  };
};

export default connect(mapStateToProps)(DepthChart);
