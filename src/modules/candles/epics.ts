import { map } from 'rxjs/operators';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { WsSend } from 'core/transport/actions';
import { RootState } from 'modules/root';
import { SubscribeToCandlesSymbolAction, CANDLE_ACTION_TYPES } from './actions';
import { Dependencies } from './../redux/store';
import { WsActions } from 'core/transport/actions';

export const subscribeToCandles: Epic<SubscribeToCandlesSymbolAction | WsSend, WsSend, RootState | undefined, Dependencies | undefined> = (action$) =>
    action$.pipe(
        ofType(CANDLE_ACTION_TYPES.CANDLE_SUBSCRIBE_TO_SYMBOL),
        map(action => {
            const { symbol, timeframe } = action.payload;
            const msg = {
                event: 'subscribe',
                channel: 'candles',
                key: ['trade', timeframe, `t${symbol}`].join(':')
            };
            return WsActions.wsSend(msg);
        })
    );

export default combineEpics(
    subscribeToCandles
);