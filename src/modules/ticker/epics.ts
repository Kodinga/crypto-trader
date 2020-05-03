import { TickerChannel } from 'core/transport/types/Channels';
import { map } from 'rxjs/operators';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { RootState } from 'modules/root';
import { SubscribeToTickerSymbolAction, TICKER_ACTION_TYPES } from './actions';
import { Dependencies } from './../redux/store';
import { WsActions } from 'core/transport/actions';

export const subscribeToTicker: Epic<SubscribeToTickerSymbolAction, any, RootState | undefined, Dependencies | undefined> = (action$) =>
    action$.pipe(
        ofType(TICKER_ACTION_TYPES.TICKER_SUBSCRIBE_TO_SYMBOL),
        map(action => {
            const { symbol } = action.payload;
            const msg = {
                channel: 'ticker' as TickerChannel,
                symbol: `t${symbol}`
            };
            return WsActions.subscribeToChannel(msg);
        })
    );

export default combineEpics(
    subscribeToTicker
);