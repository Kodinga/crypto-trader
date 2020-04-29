import { map } from 'rxjs/operators';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { WsSendAction } from './../../core/transport/actions';
import { RootState } from 'modules/root';
import { SubscribeToSymbolAction, TRADES_ACTION_TYPES } from './actions';
import { Dependencies } from './../redux/store';
import { WsActions } from 'core/transport/actions';

const subscribeToTrades: Epic<SubscribeToSymbolAction | WsSendAction, WsSendAction, RootState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(TRADES_ACTION_TYPES.SUBSCRIBE_TO_SYMBOL),
        map(action => {
            const { symbol } = action.payload;
            const msg = {
                event: 'subscribe',
                channel: 'trades',
                symbol
            };
            return WsActions.wsSend(msg);
        })
    );

export default combineEpics(
    subscribeToTrades
);