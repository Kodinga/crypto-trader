import { connect } from "react-redux";
import { RootState } from "modules/root";
import AnimatedContent, { Props } from "./AnimatedContent";
import { getSelectedCurrencyPair } from "modules/selection/selectors";

const mapStateToProps = (state: RootState): Props => {
  const selectedCurrencyPair = getSelectedCurrencyPair(state);

  return {
    currencyPair: selectedCurrencyPair,
  };
};

export default connect(mapStateToProps)(AnimatedContent);
