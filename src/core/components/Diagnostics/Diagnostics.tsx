import React, { FC, useState, useEffect } from "react";
import { Container } from "./Diagnostics.styled";

const DIAGNOSTICS_INTERVAL_MS = 2000;

const Diagnostics: FC<{}> = () => {
  const [delay, setDelay] = useState<number | undefined>();
  useEffect(() => {
    let timeoutId: number | undefined = undefined;
    const intervalId = setInterval(() => {
      const time = Date.now();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        setDelay(Date.now() - time);
      });
    }, DIAGNOSTICS_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return <Container>Latency: {delay}ms</Container>;
};

export default Diagnostics;
