import { TransportActions } from "core/transport/actions";
import subscriptions from "./reducer";

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
});
