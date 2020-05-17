import { AppActions } from "./../../modules/app/actions";
import { TransportActions } from "core/transport/actions";
import subscriptions from "./reducer";
import { ConnectionStatus } from "./types/ConnectionStatus";

describe("SubscriptionsReducer", () => {
  it("should save subscription on ack", () => {
    const channelId = 10;
    const channel = "topic";
    const request = {};
    const action = TransportActions.subscribeToChannelAck({
      channel,
      channelId,
      request,
    });
    const result = subscriptions(undefined, action);
    expect(result).toEqual({
      [channelId]: {
        channel,
        request,
      },
    });
  });

  it("should remove subscription on ack", () => {
    const channelId = 10;
    const otherChannelId = 11;
    const channel = "topic";
    const request = {};
    const initialState = {
      [channelId]: {
        channel,
        request,
      },
      [otherChannelId]: {
        channel: "other-topic",
        request: {},
      },
    };
    const action = TransportActions.unsubscribeFromChannelAck({
      channelId,
    });
    const result = subscriptions(initialState, action);
    expect(result).toEqual({
      [otherChannelId]: {
        channel: "other-topic",
        request: {},
      },
    });
  });

  it("should handle heartbeat", () => {
    const channelId = 10;
    const initialState = {
      [channelId]: {
        isStale: true,
        channel: "topic",
        request: {},
      },
    };
    const action = TransportActions.receiveMessage(
      [channelId, "hb"],
      undefined
    );

    const result = subscriptions(initialState, action);
    expect(result).toEqual({
      [channelId]: {
        isStale: false,
        channel: "topic",
        request: {},
      },
    });
  });

  it("should set subscription as stale", () => {
    const channelId = 10;
    const initialState = {
      [channelId]: {
        isStale: false,
        channel: "topic",
        request: {},
      },
    };
    const action = TransportActions.staleSubscription({ channelId });

    const result = subscriptions(initialState, action);
    expect(result).toEqual({
      [channelId]: {
        isStale: true,
        channel: "topic",
        request: {},
      },
    });
  });

  it("should clear state when bootstrapping", () => {
    const channelId = 10;
    const initialState = {
      [channelId]: {
        isStale: false,
        channel: "topic",
        request: {},
      },
    };
    const action = AppActions.bootstrapApp();
    const result = subscriptions(initialState, action);
    expect(result).toEqual({});
  });
});
