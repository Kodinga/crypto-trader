import React from "react";
import { withKnobs, text } from "@storybook/addon-knobs";
import UpdateHighlight from "./UpdateHighlight";

export default {
  title: "UpdateHighlight",
  component: UpdateHighlight,
  decorators: [withKnobs],
};

export const Default = () => {
  return <UpdateHighlight value={text("value", "1.23")} />;
};

export const Zoom = () => {
  return <UpdateHighlight value={text("value", "1.23")} effect={"zoom"} />;
};
