import { connect } from "react-redux";
import { RootState } from "modules/root";
import Trades, { Props } from "./Trades";
import { getTrades } from "../../selectors";
import { getSelectedCurrencyPair } from "modules/selection/selectors";

const mapStateToProps = (state: RootState): Props => {
  const selectedCurrencyPair = getSelectedCurrencyPair(state);
  const trades = selectedCurrencyPair
    ? getTrades(state)(selectedCurrencyPair)
    : [];

  return {
    trades,
  };
};

export default connect(mapStateToProps)(Trades);
