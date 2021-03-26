import { action } from "ts-action";
import { ActionUnion } from "../redux/utils";

export const SelectionActions = {
  selectCurrencyPair: action(
    "SELECTION/SELECT_CURRENCY_PAIR",
    (payload: { currencyPair: string }) => ({ payload })
  ),
};

export type SelectionActions = ActionUnion<typeof SelectionActions>;
export type SelectCurrencyPair = ReturnType<
  typeof SelectionActions.selectCurrencyPair
>;
