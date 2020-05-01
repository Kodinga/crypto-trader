import { map } from 'rxjs/operators';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { WsSend } from 'core/transport/actions';
import { RootState } from 'modules/root';
import { SubscribeToSymbolAction, TRADES_ACTION_TYPES } from './actions';
import { Dependencies } from './../redux/store';
import { WsActions } from 'core/transport/actions';

export const subscribeToTrades: Epic<SubscribeToSymbolAction | WsSend, WsSend, RootState | undefined, Dependencies | undefined> = (action$) =>
    action$.pipe(
        ofType(TRADES_ACTION_TYPES.TRADES_SUBSCRIBE_TO_SYMBOL),
        map(action => {
            const { symbol } = action.payload;
            const msg = {
                event: 'subscribe',
                channel: 'trades',
                symbol: `t${symbol}`
            };
            return WsActions.wsSend(msg);
        })
    );

export default combineEpics(
    subscribeToTrades
);