import React, { FC, useEffect, createRef, useState } from "react";
import { Container, Cube, FrontFace, RightFace } from "./AnimatedCube.styled";
import { usePrevious } from "core/hooks/usePrevious";
import { debounce } from "lodash";

const DEBOUNCE_RESIZE_IN_MS = 200;

export interface Props {
  trigger: any;
  children: any;
}

const AnimatedCube: FC<Props> = (props) => {
  const { trigger, children } = props;
  const [width, setWidth] = useState(0);
  const previousTrigger = usePrevious(trigger);
  const previousWidth = usePrevious(width);
  const containerRef = createRef<HTMLDivElement>();
  const cubeRef = createRef<HTMLDivElement>();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef && containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        console.log(`Update cube width to ${width}`);

        setWidth(width);
      } else {
        console.warn("Failed to update cube");
      }
    };

    const handleWindowResize = debounce(() => {
      requestAnimationFrame(updateDimensions);
    }, DEBOUNCE_RESIZE_IN_MS);

    updateDimensions();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  useEffect(() => {
    let animation: Animation | undefined = undefined;

    if (previousTrigger && previousWidth === width) {
      requestAnimationFrame(() => {
        animation = cubeRef.current?.animate(
          [
            { transform: `translateZ(-${width / 2}px)` },
            { transform: `translateZ(-${width / 2}px) rotateY(-90deg)` },
          ],
          {
            duration: 1000,
            iterations: 1,
            easing: "ease-out",
          }
        );
      });
    }

    return () => {
      if (animation) {
        animation.cancel();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, width]);

  return (
    <Container ref={containerRef} width={width}>
      <Cube ref={cubeRef} width={width}>
        {<FrontFace width={width}>{children}</FrontFace>}
        {<RightFace width={width}></RightFace>} }
      </Cube>
    </Container>
  );
};

export default AnimatedCube;
