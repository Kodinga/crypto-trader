import { connect } from "react-redux";
import { RootState } from "modules/root";
import { getLatency } from "modules/ping/selectors";
import Latency, { Props } from "./Latency";

const mapStateToProps = (state: RootState): Props => {
  const latency = getLatency(state);

  return {
    latency,
  };
};

export default connect(mapStateToProps)(Latency);
