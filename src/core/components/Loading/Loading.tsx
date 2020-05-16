import React, { FC } from "react";
import { Container, Title, Animation } from "./Loading.styled";

interface Props {
  title?: string;
}

const Loading: FC<Props> = (props) => {
  const { title = "Loading..." } = props;
  return (
    <Container>
      <Animation></Animation>
      <Title>{title}</Title>
    </Container>
  );
};

export default Loading;
