import React, { FC } from "react";
import { Container, Header, Body } from "./Widget.styled";

export interface Props {
  children: JSX.Element;
  title: string;
}

const Widget: FC<Props> = (props) => {
  const { children, title } = props;

  return (
    <Container>
      <Header>{title}</Header>
      <Body>{children}</Body>
    </Container>
  );
};

export default Widget;
