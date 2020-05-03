import { map } from 'rxjs/operators';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { RootState } from 'modules/root';
import { CandlesChannel } from 'core/transport/types/Channels';
import { SubscribeToCandlesSymbolAction, CANDLE_ACTION_TYPES } from './actions';
import { Dependencies } from './../redux/store';
import { WsActions } from 'core/transport/actions';

export const subscribeToCandles: Epic<SubscribeToCandlesSymbolAction, any, RootState | undefined, Dependencies | undefined> = (action$) =>
    action$.pipe(
        ofType(CANDLE_ACTION_TYPES.CANDLE_SUBSCRIBE_TO_SYMBOL),
        map(action => {
            const { symbol, timeframe } = action.payload;
            const msg = {
                channel: 'candles' as CandlesChannel,
                key: ['trade', timeframe, `t${symbol}`].join(':')
            };
            return WsActions.subscribeToChannel(msg);
        })
    );

export default combineEpics(
    subscribeToCandles
);