import { createAction, ActionUnion } from 'modules/redux/utils';

export enum REF_DATA_ACTION_TYPES {
    LOAD_REF_DATA = 'REF_DATA/LOAD_REF_DATA',
    LOAD_REF_DATA_ACK = 'REF_DATA/LOAD_REF_DATA_ACK',
    LOAD_REF_DATA_NACK = 'REF_DATA/LOAD_REF_DATA_NACK'
}

interface RefDataLoadAckActionPayload {
    currencyPairs: string[];
}

export const RefDataActions = {
    loadRefData: createAction<REF_DATA_ACTION_TYPES.LOAD_REF_DATA>(REF_DATA_ACTION_TYPES.LOAD_REF_DATA),
    loadRefDataAck: createAction<REF_DATA_ACTION_TYPES.LOAD_REF_DATA_ACK, RefDataLoadAckActionPayload>(REF_DATA_ACTION_TYPES.LOAD_REF_DATA_ACK),
    loadRefDataNack: createAction<REF_DATA_ACTION_TYPES.LOAD_REF_DATA_NACK>(REF_DATA_ACTION_TYPES.LOAD_REF_DATA_NACK),
};

export type RefDataActions = ActionUnion<typeof RefDataActions>;
export type LoadRefData = ReturnType<typeof RefDataActions.loadRefData>;
export type LoadRefDataAck = ReturnType<typeof RefDataActions.loadRefDataAck>;
export type LoadRefDataNack = ReturnType<typeof RefDataActions.loadRefDataNack>;