import { connect } from "react-redux";
import { RootState } from "modules/root";
import CurrencyPairTransition, { Props } from "./CurrencyPairTransition";
import { getSelectedCurrencyPair } from "modules/selection/selectors";

const mapStateToProps = (state: RootState): Props => {
  const selectedCurrencyPair = getSelectedCurrencyPair(state);

  return {
    currencyPair: selectedCurrencyPair,
  };
};

export default connect(mapStateToProps)(CurrencyPairTransition);
