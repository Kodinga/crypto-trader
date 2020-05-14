import React from "react";
import { withKnobs } from "@storybook/addon-knobs";
import Loading from "./Loading";

export default {
  title: "Loading",
  component: Loading,
  decorators: [withKnobs],
};

export const Default = () => {
  return <Loading />;
};
