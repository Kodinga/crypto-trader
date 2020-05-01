import React, { FC, useEffect, useState, createRef } from 'react';
import { usePrevious } from 'core/hooks/usePrevious';
import { Content, IdenticalPart } from './UpdateHightlight.styled';
import Palette from 'theme/style';

export const RESET_HIGHLIGHT_AFTER_MS = 1500;

export interface IProps {
    value?: string | null;
}

export const calculateParts = (value: string, prevValue: string) => {
    if (!value || !prevValue) {
        return [value, ''];
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

const UpdateHighlight: FC<IProps> = props => {
    const changedPartRef = createRef<HTMLDivElement>();
    const { value } = props;
    const prev = usePrevious(value);
    const [[identicalPart, changedPart], setParts] = useState<string[]>([]);

    useEffect(() => {
        setParts(calculateParts(value || '', prev || ''));
        let animation: Animation | undefined = undefined;
        if (typeof changedPartRef.current?.animate === 'function') {
            animation = changedPartRef.current.animate([
                // keyframes
                { color: Palette.White },
                { color: Palette.Orange },
                { color: Palette.White }
            ], {
                duration: 500,
                iterations: 2
            });
        }

        const timeoutId = setTimeout(() => {
            setParts([value || '', '']);
            if (animation) {
                animation.cancel();
            }
        }, RESET_HIGHLIGHT_AFTER_MS);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <Content>
            <IdenticalPart>{identicalPart}</IdenticalPart>
            <div ref={changedPartRef}>{changedPart}</div>
        </Content>
    );
}

export default UpdateHighlight;