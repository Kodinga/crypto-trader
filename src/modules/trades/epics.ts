import { TradesChannel } from 'core/transport/types/Channels';
import { map } from 'rxjs/operators';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { RootState, Actions } from 'modules/root';
import { SubscribeToTrades, TRADES_ACTION_TYPES } from 'modules/trades/actions';
import { Dependencies } from './../redux/store';
import { TransportActions } from 'core/transport/actions';

export const subscribeToTrades: Epic<Actions, Actions, RootState | undefined, Dependencies | undefined> = (action$) =>
    action$.pipe(
        ofType(TRADES_ACTION_TYPES.SUBSCRIBE_TO_TRADES),
        map(action => {
            const { symbol } = (action as SubscribeToTrades).payload;
            const msg = {
                channel: 'trades' as TradesChannel,
                symbol: `t${symbol}`
            };
            return TransportActions.subscribeToChannel(msg);
        })
    );

export default combineEpics(
    subscribeToTrades
);