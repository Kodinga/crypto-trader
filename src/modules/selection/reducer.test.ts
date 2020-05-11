import { SelectionActions } from "modules/selection/actions";
import selection from "./reducer";

describe("SelectionReducer", () => {
  it("should set selected currency pair", () => {
    const currencyPair = "USDBTC";
    const action = SelectionActions.selectCurrencyPair({ currencyPair });
    const result = selection(undefined, action);
    expect(result).toEqual({
      currencyPair,
    });
  });
});
