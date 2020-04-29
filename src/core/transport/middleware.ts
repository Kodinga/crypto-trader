import { Middleware, Dispatch } from 'redux';
import { Connection } from './Connection';
import { WsActions } from './actions';
import { AppActions } from 'modules/app/actions';

const createWsMiddleware = ({ connection }: { connection: Connection }): Middleware => store => (next: Dispatch) => (action: AppActions) => {
    connection.onReceive(data => {
        const parsedData = JSON.parse(data);
        let meta = undefined;
        if (Array.isArray(parsedData)) {
            const [channelId] = parsedData;
            if (store.getState().subscriptions[channelId]) {
                meta = store.getState().subscriptions[channelId];
            }
        }
        next(WsActions.wsMessage(parsedData, meta));
    });
    return next(action);
}

export default createWsMiddleware;