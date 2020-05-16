import React, { FC } from "react";
import { withKnobs, select } from "@storybook/addon-knobs";
import { StoryFn } from "@storybook/addons";
import Palette from "theme/style";
import AnimatedCube from "./AnimatedCube";

const Container: FC<any> = ({ children }) => (
  <div
    style={{
      width: "400px",
      height: "500px",
      color: Palette.White,
    }}
  >
    {children}
  </div>
);

export default {
  title: "AnimatedCube",
  component: AnimatedCube,
  decorators: [
    withKnobs,
    (storyFn: StoryFn) => <Container>{storyFn()}</Container>,
  ],
};

export const Default = () => {
  return (
    <AnimatedCube trigger={select("trigger", ["1", "2"], "1")}>
      Hello
    </AnimatedCube>
  );
};
