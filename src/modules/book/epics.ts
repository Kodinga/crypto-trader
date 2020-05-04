import { BookChannel } from 'core/transport/types/Channels';
import { map } from 'rxjs/operators';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { RootState, Actions } from 'modules/root';
import { BookSubscribeToSymbol, BOOK_ACTION_TYPES } from './actions';
import { Dependencies } from './../redux/store';
import { WsActions } from 'core/transport/actions';

export const subscribeToBook: Epic<Actions, Actions, RootState | undefined, Dependencies | undefined> = (action$) =>
    action$.pipe(
        ofType(BOOK_ACTION_TYPES.BOOK_SUBSCRIBE_TO_SYMBOL),
        map(action => {
            const { symbol } = (action as BookSubscribeToSymbol).payload;
            const msg = {
                channel: 'book' as BookChannel,
                symbol: `t${symbol}`,
                prec: 'R0'
            };
            return WsActions.subscribeToChannel(msg);
        })
    );

export default combineEpics(
    subscribeToBook
);