import { TradesChannel } from 'core/transport/types/Channels';
import { map } from 'rxjs/operators';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { RootState } from 'modules/root';
import { TradesSubscribeToSymbol, TRADES_ACTION_TYPES } from './actions';
import { Dependencies } from './../redux/store';
import { WsActions } from 'core/transport/actions';

export const subscribeToTrades: Epic<TradesSubscribeToSymbol, any, RootState | undefined, Dependencies | undefined> = (action$) =>
    action$.pipe(
        ofType(TRADES_ACTION_TYPES.TRADES_SUBSCRIBE_TO_SYMBOL),
        map(action => {
            const { symbol } = action.payload;
            const msg = {
                channel: 'trades' as TradesChannel,
                symbol: `t${symbol}`
            };
            return WsActions.subscribeToChannel(msg);
        })
    );

export default combineEpics(
    subscribeToTrades
);