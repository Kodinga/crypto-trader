import { Middleware, Dispatch } from 'redux';
import { AppActions } from 'modules/app/actions';
import { Connection } from './Connection';
import { TransportActions } from './actions';

const createWsMiddleware = ({ connection }: { connection: Connection }): Middleware => store => (next: Dispatch) => (action: AppActions) => {
    connection.onReceive(data => {
        const parsedData = JSON.parse(data);
        let meta = undefined;
        let channelId = undefined;

        if (Array.isArray(parsedData)) {
            channelId = parsedData[0];
        } else if (parsedData.hasOwnProperty('chanId')) {
            channelId = parsedData.chanId;
        }
        if (channelId && store.getState().subscriptions[channelId]) {
            meta = store.getState().subscriptions[channelId];
        }
        next(TransportActions.receiveMessage(parsedData, meta));
    });
    return next(action);
}

export default createWsMiddleware;