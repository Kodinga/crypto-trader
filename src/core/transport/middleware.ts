import { Middleware, Dispatch } from 'redux';
import { AppActions } from 'modules/app/actions';
import { Connection } from './Connection';
import { TransportActions } from './actions';

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
        next(TransportActions.receiveMessage(parsedData, meta));
    });
    return next(action);
}

export default createWsMiddleware;