import { createAction, ActionUnion } from '../redux/utils';

export enum APP_ACTION_TYPES {
    BOOTSTRAP_APP = 'BOOTSTRAP_APP'
}

export const AppActions = {
    bootstrapApp: createAction<APP_ACTION_TYPES.BOOTSTRAP_APP>(APP_ACTION_TYPES.BOOTSTRAP_APP)
};

export type AppActions = ActionUnion<typeof AppActions>;
export type BoostrapAppAction = ReturnType<typeof AppActions.bootstrapApp>;

