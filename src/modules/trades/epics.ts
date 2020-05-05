import { UnsubscribeFromTrades } from './actions';
import { TradesChannel } from 'core/transport/types/Channels';
import { map, mergeMap } from 'rxjs/operators';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { RootState, Actions } from 'modules/root';
import { SubscribeToTrades, TRADES_ACTION_TYPES } from 'modules/trades/actions';
import { Dependencies } from './../redux/store';
import { TransportActions } from 'core/transport/actions';
import { getSubscription } from 'core/transport/selectors';
import { from } from 'rxjs';

export const subscribeToTrades: Epic<Actions, Actions, RootState, Dependencies> = (action$) =>
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


export const unsubscribeFromTrades: Epic<Actions, Actions, RootState, Dependencies> = (action$, state$) =>
    action$.pipe(
        ofType(TRADES_ACTION_TYPES.UNSUBSCRIBE_FROM_TRADES),
        mergeMap(action => {
            const { symbol } = (action as UnsubscribeFromTrades).payload;
            const result: Actions[] = [];
            const channelId = getSubscription(state$.value)('trades', {
                symbol: `t${symbol}`
            });
            if (typeof channelId !== 'undefined') {
                result.push(
                    TransportActions.unsubscribeFromChannel({
                        channelId
                    })
                );
            }
            return from(result);
        })
    );


export default combineEpics(
    subscribeToTrades,
    unsubscribeFromTrades
);