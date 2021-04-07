import { action } from "ts-action";
import { ActionUnion } from "../redux/utils";

export const AppActions = {
  bootstrapApp: action("APP/BOOTSTRAP_APP"),
};

export type AllAppActions = ActionUnion<typeof AppActions>;
export type BoostrapApp = ReturnType<typeof AppActions.bootstrapApp>;
