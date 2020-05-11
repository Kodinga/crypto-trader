import { createSelector } from "reselect";
import { RootState } from "modules/root";

const subscriptionsSelector = (state: RootState) => state.subscriptions;

export const getSubscriptions = createSelector(
  subscriptionsSelector,
  (subscriptions) => subscriptions
);

export const getSubscription = createSelector(
  getSubscriptions,
  (subscriptions) => (channel: string, request: any) => {
    const channelIds = Object.keys(subscriptions).map(Number);

    return channelIds.find((channelId) => {
      return (
        subscriptions[channelId].channel === channel &&
        Object.keys(request).every(
          (key) => request[key] === subscriptions[channelId].request[key]
        )
      );
    });
  }
);
