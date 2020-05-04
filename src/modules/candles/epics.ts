import { map } from 'rxjs/operators';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { RootState, Actions } from 'modules/root';
import { CandlesChannel } from 'core/transport/types/Channels';
import { TransportActions } from 'core/transport/actions';
import { SubscribeToCandles, CANDLES_ACTION_TYPES } from './actions';
import { Dependencies } from './../redux/store';

export const subscribeToCandles: Epic<Actions, Actions, RootState | undefined, Dependencies | undefined> = (action$) =>
    action$.pipe(
        ofType(CANDLES_ACTION_TYPES.SUBSCRIBE_TO_CANDLES),
        map(action => {
            const { symbol, timeframe } = (action as SubscribeToCandles).payload;
            const msg = {
                channel: 'candles' as CandlesChannel,
                key: ['trade', timeframe, `t${symbol}`].join(':')
            };
            return TransportActions.subscribeToChannel(msg);
        })
    );

export default combineEpics(
    subscribeToCandles
);