import { map } from 'rxjs/operators';
import { Epic, ofType, combineEpics } from 'redux-observable';
import { TransportActions } from 'core/transport/actions';
import { BookChannel } from 'core/transport/types/Channels';
import { RootState, Actions } from 'modules/root';
import { SubscribeToBook, BOOK_ACTION_TYPES } from './actions';
import { Dependencies } from './../redux/store';

export const subscribeToBook: Epic<Actions, Actions, RootState | undefined, Dependencies | undefined> = (action$) =>
    action$.pipe(
        ofType(BOOK_ACTION_TYPES.SUBSCRIBE_TO_BOOK),
        map(action => {
            const { symbol } = (action as SubscribeToBook).payload;
            const msg = {
                channel: 'book' as BookChannel,
                symbol: `t${symbol}`,
                prec: 'R0'
            };
            return TransportActions.subscribeToChannel(msg);
        })
    );

export default combineEpics(
    subscribeToBook
);