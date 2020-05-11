import React, { FC, useEffect, useState, createRef } from "react";
import { usePrevious } from "core/hooks/usePrevious";
import {
    Content,
    IdenticalPart,
    DigitContainer,
} from "./UpdateHightlight.styled";
import Palette from "theme/style";

export interface Props {
    value?: string | null;
    effect?: "zoom" | "default";
}

export const calculateParts = (value: string, prevValue: string) => {
    if (!value || !prevValue) {
        return [value, ""];
    }
    const length = Math.min(value.length, prevValue.length);
    let index = 0;
    for (let i = 0; i < length; i++) {
        if (value[i] === prevValue[i]) {
            index++;
        } else {
            break;
        }
    }
    return [value.slice(0, index), value.slice(index, value.length)];
};

const AnimatedValue: FC<{
    value: string;
    delay?: number;
    scale?: number;
    duration?: number;
}> = (props) => {
    const { value, delay = 0, scale = 1, duration = 200 } = props;
    const ref = createRef<HTMLDivElement>();

    useEffect(() => {
        let animation: Animation | undefined = undefined;
        let timeoutId: number | undefined = undefined;

        if (typeof ref.current?.animate === "function") {
            const runAnimation = () => {
                animation = ref.current?.animate(
                    [
                        // keyframes
                        { color: Palette.Orange, transform: "scale(1)" },
                        ...(scale === 1
                            ? []
                            : [{ color: Palette.White, transform: `scale(${scale})` }]),
                        { color: Palette.White, transform: "scale(1)" },
                    ],
                    {
                        duration,
                        iterations: 1,
                    }
                );
            };

            if (delay) {
                timeoutId = setTimeout(
                    () => requestAnimationFrame(runAnimation),
                    delay
                );
            } else {
                requestAnimationFrame(runAnimation);
            }
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (animation) {
                animation.cancel();
            }
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return <DigitContainer ref={ref}>{value}</DigitContainer>;
};

const UpdateHighlight: FC<Props> = (props) => {
    const changedPartRef = createRef<HTMLDivElement>();
    const { value, effect = "default" } = props;
    const prev = usePrevious(value);
    const [[identicalPart, changedPart], setParts] = useState<string[]>([]);

    useEffect(() => {
        setParts(calculateParts(value || "", prev || ""));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const digits = effect === "zoom"
        ? changedPart?.split("").map((digit, index) => (
            <AnimatedValue key={index} value={digit} delay={index * 100} scale={2} duration={300} />
        ))
        : <AnimatedValue value={changedPart} />
    return (
        <Content>
            <IdenticalPart>{identicalPart}</IdenticalPart>
            <div ref={changedPartRef}>
                {digits}
            </div>
        </Content>
    );
};

export default UpdateHighlight;
