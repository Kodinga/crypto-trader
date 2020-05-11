import { createSelector } from "reselect";
import { RootState } from "modules/root";

const selectionSelector = (state: RootState) => state.selection;

export const getSelectedCurrencyPair = createSelector(
  selectionSelector,
  (selection) => selection.currencyPair
);
