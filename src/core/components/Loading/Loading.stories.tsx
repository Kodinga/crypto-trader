import React, { FC } from "react";
import { withKnobs } from "@storybook/addon-knobs";
import { StoryFn } from "@storybook/addons";
import Palette from "theme/style";
import Loading from "./Loading";

const Container: FC<any> = ({ children }) => (
  <div
    style={{
      width: "400px",
      height: "300px",
      position: "relative",
      backgroundColor: Palette.BackgroundColor,
    }}
  >
    {children}
  </div>
);

export default {
  title: "Loading",
  component: Loading,
  decorators: [
    withKnobs,
    (storyFn: StoryFn) => <Container>{storyFn()}</Container>,
  ],
};

export const Default = () => {
  return <Loading />;
};
