import { map } from 'rxjs/operators';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { TransportActions } from 'core/transport/actions';
import { TickerChannel } from 'core/transport/types/Channels';
import { RootState, Actions } from 'modules/root';
import { SubscribeToTickerAction, TICKER_ACTION_TYPES } from './actions';
import { Dependencies } from './../redux/store';

export const subscribeToTicker: Epic<Actions, Actions, RootState | undefined, Dependencies | undefined> = (action$) =>
    action$.pipe(
        ofType(TICKER_ACTION_TYPES.SUBSCRIBE_TO_TICKER),
        map(action => {
            const { symbol } = (action as SubscribeToTickerAction).payload;
            const msg = {
                channel: 'ticker' as TickerChannel,
                symbol: `t${symbol}`
            };
            return TransportActions.subscribeToChannel(msg);
        })
    );

export default combineEpics(
    subscribeToTicker
);