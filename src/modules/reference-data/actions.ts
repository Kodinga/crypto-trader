import { action } from "ts-action";
import { ActionUnion } from "modules/redux/utils";

export const RefDataActions = {
  loadRefData: action("REF_DATA/LOAD_REF_DATA"),
  loadRefDataAck: action(
    "REF_DATA/LOAD_REF_DATA_ACK",
    (payload: { currencyPairs: string[] }) => ({ payload })
  ),
  loadRefDataNack: action("REF_DATA/LOAD_REF_DATA_NACK"),
};

export type RefDataActions = ActionUnion<typeof RefDataActions>;
export type LoadRefData = ReturnType<typeof RefDataActions.loadRefData>;
export type LoadRefDataAck = ReturnType<typeof RefDataActions.loadRefDataAck>;
export type LoadRefDataNack = ReturnType<typeof RefDataActions.loadRefDataNack>;
