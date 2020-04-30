import { createAction, ActionUnion } from 'modules/redux/utils';

export enum REF_DATA_ACTION_TYPES {
    REF_DATA_LOAD = 'REF_DATA_LOAD',
    REF_DATA_LOAD_ACK = 'REF_DATA_LOAD_ACK',
    REF_DATA_LOAD_NACK = 'REF_DATA_LOAD_NACK'
}

interface RefDataLoadAckActionPayload {
    currencyPairs: string[];
}

export const RefDataActions = {
    refDataLoad: createAction<REF_DATA_ACTION_TYPES.REF_DATA_LOAD>(REF_DATA_ACTION_TYPES.REF_DATA_LOAD),
    refDataLoadAck: createAction<REF_DATA_ACTION_TYPES.REF_DATA_LOAD_ACK, RefDataLoadAckActionPayload>(REF_DATA_ACTION_TYPES.REF_DATA_LOAD_ACK),
    refDataLoadNack: createAction<REF_DATA_ACTION_TYPES.REF_DATA_LOAD_NACK>(REF_DATA_ACTION_TYPES.REF_DATA_LOAD_NACK),
};

export type RefDataActions = ActionUnion<typeof RefDataActions>;
export type RefDataLoad = ReturnType<typeof RefDataActions.refDataLoad>;
export type RefDataLoadAck = ReturnType<typeof RefDataActions.refDataLoadAck>;
export type RefDataLoadNack = ReturnType<typeof RefDataActions.refDataLoadNack>;