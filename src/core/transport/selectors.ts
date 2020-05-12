import { createSelector } from "reselect";
import { RootState } from "modules/root";
import { Channel } from "./types/Channels";

const subscriptionsSelector = (state: RootState) => state.subscriptions;

export const getSubscriptions = createSelector(
  subscriptionsSelector,
  (subscriptions) => subscriptions
);

export const getSubscriptionId = createSelector(
  getSubscriptions,
  (subscriptions) => (channel: Channel, request: any = {}) => {
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

export const getIsSubscriptionStale = createSelector(
  getSubscriptions,
  subscriptions => (subscriptionId: number) => Boolean((subscriptions[subscriptionId] || {}).isStale)
);
